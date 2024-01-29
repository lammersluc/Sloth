const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const play = require('play-dl');
const fs = require('fs');
const { similarity, sleep } = require('../utils.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = {
    name: 'musicquiz',
    description: 'Starts a music quiz.',
    category: 'music',
    options: [
        {
            name: 'rounds',
            type: 'integer',
            minValue: 3,
            maxValue: 100,
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let rounds = interaction.options.getInteger('rounds');

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) return interaction.editReply({ embeds: [embed.setDescription('I need permissions to send messages in this channel in order to play a music quiz.')] });
        if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [embed.setDescription('You are not in a voice channel.')] });
        if (!interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect) || !interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to join or speak in this voice channel.')] });
        if (client.queue.get(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am already playing music.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('A music quiz is already in progress.')] });

        client.musicquiz.push(interaction.guildId);
        let players = interaction.member.voice.channel.members.filter(member => !member.user.bot).map(member => member.id);
        let round = 0;
        let played = [];

        let scoreboard = players.map(p => { return { player: p, score: 0 }});
        let textScoreboard = [];

        interaction.editReply({ embeds: [embed
            .setTitle('Music Quiz')
            .setDescription(`The music quiz has started. You have **30 seconds** to guess each song. There are **${rounds} rounds**. If you don\'t know a song you can type \`pass\`.
            You can stop the quiz at any time by typing \`stopquiz\`.`)
            .addFields(
                { name: 'Points', value: '\`\`\`diff\n+ 1 point for the song name\n+ 1 point for the artist name\n+ 1 point for both\`\`\`' },
                { name: 'Players', value: scoreboard.map(p => `<@${p.player}>`).toString().replace(/,/g, '\n') }
                )
        ]});

        let connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        let player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        let resource = createAudioResource('./src/ext/countdown.mp3', {
            inlineVolume: true
        });
        resource.volume.setVolume(client.volume);

        player.play(resource);
        connection.subscribe(player);

        await new Promise((resolve) => player.on('idle', () => resolve() ));

        let data = await JSON.parse(fs.readFileSync('./src/ext/spotify.json'));
        let tracks = data[0].tracks;

        while (round < rounds) {

            let roundfinished = false;
            let song;
            let random = Math.floor(Math.random() * tracks.length);
            while (played.includes(random)) random = Math.floor(Math.random() * tracks.length);
            song = tracks[random];
            played.push(random);

            let tGuessed = '';
            let aGuessed = '';
            let passVotes = [];
            let title = song.name.split(/[-]/)[0].replace(/\([^()]*\)/g, '').trim().toLowerCase();
            let artists = [];
            if (song.artist.constructor === Array) song.artist.forEach(a => artists.push(a.toLowerCase()));
            else artists.push(song.artist.toLowerCase());

            let search = (await play.search(`${title} ${artists.join(' ')} official`)).filter(v => !v.discretionAdvised)[0];
            let stream = await play.stream(search.url, { seek: Math.floor(search.durationInSec / 3) });
            let resource = createAudioResource(stream.stream, {
                inlineVolume: true,
                inputType: stream.type,
            });
            resource.volume.setVolume(client.volume);
            
            player.play(resource);
            connection.subscribe(player);

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

                    if (passVotes.length > players.length * 0.66) collector.stop();

                    return;

                }

                let tScore = similarity(m.content.toLowerCase(), title);
                let aScore = Math.max(...artists.map(a => similarity(m.content.toLowerCase(), a)));

                if (!tGuessed && tScore >= 0.75) {

                    m.react('✅'); 
                    scoreboard.forEach(player => player.player === m.author.id && player.score ++);
                    tGuessed = m.author.id; 

                } else if (!aGuessed && aScore >= 0.75) {

                    m.react('✅');
                    scoreboard.forEach(player => player.player === m.author.id && player.score ++);
                    aGuessed = m.author.id;

                } else m.react('❌');

                if (tGuessed && aGuessed) {

                    if (tGuessed === aGuessed) scoreboard.forEach(player => player.player === tGuessed && player.score ++);

                    collector.stop();

                }
            
            });

            collector.on('end', async () => {

                scoreboard.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0);
                let pMedal = '';
                textScoreboard = scoreboard.map((p, i) => { 

                    let medals = ['🥇', '🥈', '🥉'];


                    if (i > 0 && scoreboard[i - 1].score === p.score) {
                        return ({ player: `${pMedal} <@${p.player}>`, score: p.score });
                    } else if (medals[i]) {
                        pMedal = medals[i];
                        return ({ player: `${medals[i]} <@${p.player}>`, score: p.score });
                    } else {
                        pMedal = '';
                        return ({ player: `<@${p.player}>`, score: p.score });
                    }

                });


                interaction.channel.send({ embeds: [new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setTitle(`\`${song.name}\` - \`${song.artist.toString().replace(/,/g, ', ')}\``)
                    .setURL(search.url)
                    .setDescription(`\`${search.views.toLocaleString()} 👀 | ${search.durationRaw}\``)
                    .setThumbnail(search.thumbnails[0].url)
                    .addFields({ name: 'Scoreboard', value: textScoreboard.map(p => `${p.player} - ${p.score} pts`).toString().replace(/,/g, '\n') })
                    .setFooter({ text: `Round ${round + 1} / ${rounds}` })
                ]});

                round ++;
                roundfinished = true;

            });

            while (!roundfinished) await sleep(1000);

        }

        player.stop();
        connection.destroy();
        client.musicquiz.splice(client.musicquiz.indexOf(interaction.guildId), 1);
        interaction.channel.send({ embeds: [new EmbedBuilder()
            .setColor(client.embedColor)
            .setTitle('Music Quiz').setDescription(`The music quiz has ended.\n
            ${scoreboard.length === 1 || scoreboard[0].score !== scoreboard[1].score ? `<@${scoreboard[0].player}> has won with **${scoreboard[0].score} points**!` : `It's a tie between${scoreboard.map(p => p.score === scoreboard[0].score && ` <@${p.player}>`)} with **${scoreboard[0].score} points**!`}\n`)
            .addFields({ name: 'Scoreboard', value: textScoreboard.map(p => `${p.player} - ${p.score} pts`).toString().replace(/,/g, '\n') })
        ] });
        
    }
}
