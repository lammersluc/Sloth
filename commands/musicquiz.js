const { EmbedBuilder, Embed } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');
const stringSimilarity = require('string-similarity');
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    name: 'musicquiz',
    helpname: 'Music Quiz',
    aliases: ['mq'],
    aliasesText: 'MQ',
    description: 'Starts a music quiz.',
    usage: 'MusicQuiz [Rounds]',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (!message.member.voice.channel) return message.channel.send({ embeds: [embed.setTitle('You are not in a voice channel.')] });
        if (!args) return message.channel.send({ embeds: [embed.setTitle('Please specify the amount of rounds.')] });
        if (isNaN(args[0]) || args[0] < 3 || args[0] > 30) return message.channel.send({ embeds: [embed.setTitle('Please specify a number between 3 and 30.')] });
        if (client.distube.getQueue(message)) return message.channel.send({ embeds: [embed.setTitle('I am already playing music.')] });

        client.musicquiz = true;
        let scoreboard = [];
        let textScoreboard = [];
        let players = message.member.voice.channel.members.filter(member => !member.user.bot).map(member => member.user.id);
        players.map(member => scoreboard.push({ player: member, score: 0 }));
        const songs = parseInt(args[0]);
        let round = 0;

        message.channel.send({ embeds: [embed
            .setTitle('Music Quiz')
            .setDescription(`The music quiz has started. You have **30 seconds** to guess each song. There are **${args[0]} rounds**. If you don\'t know a song you can type \`pass\`.`)
            .addFields(
                { name: 'Points', value: '\`\`\`diff\n+ 1 point for the song name\n+ 1 point for the artist name\n+ 3 points for both\`\`\`' },
                { name: 'Players', value: scoreboard.map(player => `<@${player.player}>`).toString().replace(/,/g, '\n') }
                )
        ]});

        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
          });

        accessToken = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(accessToken.body['access_token']);

        const tracksResponse = await spotifyApi.getPlaylistTracks(process.env.SPOTIFY_PLAYLIST_ID);
        const tracks = tracksResponse.body.items;

        while (round < songs) {

            let roundfinished = false;
            let randomIndex = Math.floor(Math.random() * tracks.length);
            let song = tracks[randomIndex];
            let sguessed = '';
            let aguessed = '';
            let skipVotes = [];
            const title = song.track.name.split(/[(-]/)[0].toLowerCase();
            const artists = song.track.artists.map(artist => artist.name.toLowerCase());

            await client.distube.play(message.member.voice.channel, song.track.external_urls.spotify)
            let queue = client.distube.getQueue(message);
            if (queue.songs.length > 1) queue.skip();
            await sleep(300)
            queue.seek(queue.songs[0].duration / 3);

            const filter = m => players.includes(m.author.id);
            const collector = message.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', async m => {
                
                if (m.content.startsWith(client.prefix + 'leave')) return collector.stop();
                if (m.content.startsWith(client.prefix)) return;
                if (m.content.toLowerCase() === 'pass' && !skipVotes.includes(m.author.id)) {

                    skipVotes.push(m.author.id);
                    m.react('⏭️')

                    if (skipVotes.length > players.length / 2) collector.stop();

                    return;

                }

                if (!sguessed && stringSimilarity.compareTwoStrings(m.content.toLowerCase(), title) > 0.57) {
                    m.react('✅'); 
                    scoreboard.map(player => player.player == m.author.id ? player.score ++ : null);
                    sguessed = m.author.id; 
                } else if (!aguessed && stringSimilarity.findBestMatch(m.content.toLowerCase(), artists).bestMatch.rating > 0.57) {
                    m.react('✅');
                    scoreboard.map(player => player.player == m.author.id ? player.score ++ : null);
                    aguessed = m.author.id;
                } else {
                    m.react('❌');
                }

                if (sguessed !== '' && aguessed !== '') {
                    if (sguessed === aguessed) scoreboard.map(player => player.player == sguessed ? player.score ++ : null);
                    collector.stop();
                }
            
            });

            collector.on('end', async () => {

                let queue = client.distube.getQueue(message);
                if (!queue) return;
                let psong = queue.songs[0];
                scoreboard.sort((a, b) => (a.score < b.score) ? 1 : -1);
                textScoreboard = scoreboard.map(p => { 

                    let i = scoreboard.indexOf(p);

                    if (i === 0) return ({ player: `🥇 <@${p.player}>`, score: p.score });
                    else if (i === 1) return ({ player: `🥈 <@${p.player}>`, score: p.score });
                    else if (i === 2) return ({ player: `🥉 <@${p.player}>`, score: p.score });
                    else return ({ player: `<@${p.player}>`, score: p.score });

                });

                message.channel.send({ embeds: [new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setTitle(`\`${song.track.name}\` - \`${song.track.artists.map(artist => artist.name).toString().replace(/,/g, ', ')}\``)
                    .setURL(psong.url)
                    .setDescription(`\`${psong.views.toLocaleString()} 👀 | ${psong.likes.toLocaleString()} 👍 | ${psong.formattedDuration} | 🔊 ${queue.volume}%\``)
                    .setThumbnail(psong.thumbnail)
                    .setTimestamp()
                    .addFields({ name: 'Scoreboard', value: textScoreboard.map(player => `${player.player} - ${player.score} pts`).toString().replace(/,/g, '\n') })
                    .setFooter({ text: `Round ${round + 1} / ${songs}` })
                ]});

                round ++;
                roundfinished = true;

            });

            while (!roundfinished) { await new Promise(r => setTimeout(r, 1000)); }

        }

        client.distube.voices.leave(message);
        client.musicquiz = false;
        message.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.embedColor)
            .setTitle('Music Quiz').setDescription(`The music quiz has ended.\n
            <@${scoreboard[0].player}> has won with **${scoreboard[0].score} points**!`)
            .addFields({ name: 'Scoreboard', value: textScoreboard.map(player => `${player.player} - ${player.score} pts`).toString().replace(/,/g, '\n') })
        ] });
        
    }
}