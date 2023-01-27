const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const SpotifyWebApi = require('spotify-web-api-node');
const stringSimilarity = require('string-similarity');
const { sleep } = require('../utils.js');

module.exports = {
    name: 'musicquiz',
    aliases: ['mq'],
    description: 'Starts a music quiz.',
    category: 'music',
    options: [{ name: 'rounds', forced: true}],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let rounds = parseInt(interaction.options.getString('rounds'));

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) return interaction.editReply({ embeds: [embed.setTitle('I need permissions to send messages in this channel in order to play a music quiz.')] });
        if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [embed.setTitle('You are not in a voice channel.')] });
        if (!interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect) || !interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply({ embeds: [embed.setTitle('I do not have permission to join or speak in this voice channel.')] });
        if (rounds < 3 || rounds > 100) return interaction.editReply({ embeds: [embed.setTitle('Please specify a number between 3 and 100.')] });
        if (client.distube.getQueue(interaction.guild)) return interaction.editReply({ embeds: [embed.setTitle('I am already playing music.')] });

        client.musicquiz.push(interaction.guildId);
        let scoreboard = [];
        let textScoreboard = [];
        let players = interaction.member.voice.channel.members.filter(member => !member.user.bot).map(member => member.id);
        let round = 0;
        let played = [];

        players.map(member => scoreboard.push({ player: member, score: 0 }));

        interaction.editReply({ embeds: [embed
            .setTitle('Music Quiz')
            .setDescription(`The music quiz has started. You have **30 seconds** to guess each song. There are **${rounds} rounds**. If you don\'t know a song you can type \`pass\`.
            You can stop the quiz at any time by typing \`stopquiz\`.`)
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

        let data = await spotifyApi.getPlaylist(process.env.SPOTIFY_PLAYLIST_ID);
        let playlistTotal = data.body.tracks.total;

        const tracksResponse = await spotifyApi.getPlaylistTracks(process.env.SPOTIFY_PLAYLIST_ID, { offset: 101 });
        const tracks = tracksResponse.body.items;

        while (round < rounds) {

            let roundfinished = false;
            let randomIndex = Math.floor(Math.random() * 100);
            let song = tracks[randomIndex];
            while (played.includes(song.track.id)) { song = tracks[randomIndex]; }
            played.push(song.track.id);
            let sguessed = '';
            let aguessed = '';
            let passVotes = [];
            const title = song.track.name.split(/[(-]/)[0].toLowerCase();
            const artists = song.track.artists.map(artist => artist.name.toLowerCase());

            await client.distube.play(interaction.member.voice.channel, song.track.external_urls.spotify)
            let queue = client.distube.getQueue(interaction);
            if (queue.songs.length > 1) queue.skip();
            await sleep(300)
            queue.seek(queue.songs[0].duration / 3);

            const filter = m => players.includes(m.author.id);
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', async m => {

                if (m.content.toLowerCase() === 'stopquiz') {
                    rounds = round + 1;
                    return collector.stop();
                }

                if (m.content.toLowerCase() === 'pass' && !passVotes.includes(m.author.id)) {

                    passVotes.push(m.author.id);
                    m.react('⏭️')

                    if (passVotes.length >= players.length * 0.75) collector.stop();

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

                let queue = client.distube.getQueue(interaction);
                if (!queue) return;
                let psong = queue.songs[0];
                scoreboard.sort((a, b) => (a.score < b.score) ? 1 : -1);
                textScoreboard = scoreboard.map(p => { 

                    let medals = ['🥇', '🥈', '🥉']
                    let i = scoreboard.indexOf(p);

                    if(medals[i]) {
                        return ({ player: `${medals[i]} <@${p.player}>`, score: p.score })
                    } else {
                        return ({ player: `<@${p.player}>`, score: p.score });
                    }

                });


                interaction.channel.send({ embeds: [new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setTitle(`\`${song.track.name}\` - \`${song.track.artists.map(artist => artist.name).toString().replace(/,/g, ', ')}\``)
                    .setURL(psong.url)
                    .setDescription(`\`${psong.views.toLocaleString()} 👀 | ${psong.likes.toLocaleString()} 👍 | ${psong.formattedDuration} | 🔊 ${queue.volume}%\``)
                    .setThumbnail(psong.thumbnail)
                    .setTimestamp()
                    .addFields({ name: 'Scoreboard', value: textScoreboard.map(player => `${player.player} - ${player.score} pts`).toString().replace(/,/g, '\n') })
                    .setFooter({ text: `Round ${round + 1} / ${rounds}` })
                ]});

                round ++;
                roundfinished = true;

            });

            while (!roundfinished) { await new Promise(r => setTimeout(r, 1000)); }

        }

        client.distube.voices.leave(interaction);
        client.musicquiz.splice(client.musicquiz.indexOf(interaction.guildId), 1);
        interaction.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.embedColor)
            .setTitle('Music Quiz').setDescription(`The music quiz has ended.\n
            <@${scoreboard[0].player}> has won with **${scoreboard[0].score} points**!`)
            .addFields({ name: 'Scoreboard', value: textScoreboard.map(player => `${player.player} - ${player.score} pts`).toString().replace(/,/g, '\n') })
        ] });
        
    }
}
