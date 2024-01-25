import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import play from 'play-dl';
import fs from 'fs';
import { similarity, sleep } from '../utils.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';

export default {
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
    run: async (client:any , interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let rounds = interaction.options.getInteger('rounds');

        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) return interaction.editReply({ embeds: [embed.setTitle('I need permissions to send messages in this channel in order to play a music quiz.')] });
        if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [embed.setTitle('You are not in a voice channel.')] });
        if (!interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect) || !interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply({ embeds: [embed.setTitle('I do not have permission to join or speak in this voice channel.')] });
        if (client.queue.get(interaction.guildId)) return interaction.editReply({ embeds: [embed.setTitle('I am already playing music.')] });

        client.musicquiz.push(interaction.guildId);
        let scoreboard: any[] = [];
        let textScoreboard: any[] = [];
        let players: string[] = interaction.member.voice.channel.members.filter((member: any) => !member.user.bot).map((member: any) => member.id);
        let round = 0;
        let played: number[] = [];

        players.forEach(member => scoreboard.push({ player: member, score: 0 }));

        interaction.editReply({ embeds: [embed
            .setTitle('Music Quiz')
            .setDescription(`The music quiz has started. You have **30 seconds** to guess each song. There are **${rounds} rounds**. If you don\'t know a song you can type \`pass\`.
            You can stop the quiz at any time by typing \`stopquiz\`.`)
            .addFields(
                { name: 'Points', value: '\`\`\`diff\n+ 1 point for the song name\n+ 1 point for the artist name\n+ 3 points for both\`\`\`' },
                { name: 'Players', value: scoreboard.map(player => `<@${player.player}>`).toString().replace(/,/g, '\n') }
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

        let data = await JSON.parse(fs.readFileSync('./src/ext/spotify.json').toString());
        let tracks = data[0].tracks;

        while (round < rounds) {

            let roundfinished = false;
            let song: any;
            let random = Math.floor(Math.random() * tracks.length);
            while (played.includes(random)) random = Math.floor(Math.random() * tracks.length);
            song = tracks[random];
            played.push(random);

            let sguessed = '';
            let aguessed = '';
            let passVotes: string[] = [];
            let title = song.name.split(/[(-]/)[0].toLowerCase();
            let artists: string[] = [];
            if (song.artist && song.artist.constructor == Array) song.artist.forEach((a: string) => artists.push(a.toLowerCase()));
            else if (song.artist) artists.push(song.artist.toLowerCase());


            let result = await play.search(`${title} ${artists.join(' ')} lyrics`, { limit: 1 });
            let stream = await play.stream(result[0].url, { seek: Math.floor(result[0].durationInSec / 3) });
            let resource = createAudioResource(stream.stream, {
                inputType: stream.type,
            });

            player.play(resource);

            connection.subscribe(player);

            const filter = (m: any) => players.includes(m.author.id);
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', async (m: any) => {

                if (m.content.toLowerCase() == 'stopquiz') {
                    rounds = round + 1;
                    return collector.stop();
                }

                if (m.content.toLowerCase() == 'pass' && !passVotes.includes(m.author.id)) {

                    passVotes.push(m.author.id);
                    m.react('⏭️')

                    if (passVotes.length >= players.length * 0.75) collector.stop();

                    return;

                }

                let tscore = similarity(m.content.toLowerCase(), title);
                let ascore = Math.max(...artists.map(a => similarity(m.content.toLowerCase(), a)));

                if (!sguessed && tscore > 0.75) {

                    m.react('✅'); 
                    scoreboard.forEach(player => player.player == m.author.id ? player.score ++ : null);
                    sguessed = m.author.id; 

                } else if (!aguessed && ascore > 0.75) {

                    m.react('✅');
                    scoreboard.forEach(player => player.player == m.author.id ? player.score ++ : null);
                    aguessed = m.author.id;

                } else m.react('❌');

                if (sguessed && aguessed) {

                    if (sguessed == aguessed) scoreboard.forEach(player => player.player == sguessed ? player.score ++ : null);

                    collector.stop();

                }
            
            });

            collector.on('end', async () => {

                let psong = result[0];
                scoreboard.sort((a, b) => (a.score < b.score) ? 1 : -1);
                textScoreboard = scoreboard.map(p => { 

                    let medals = ['🥇', '🥈', '🥉'];
                    let i = scoreboard.indexOf(p);

                    if(medals[i]) {
                        return ({ player: `${medals[i]} <@${p.player}>`, score: p.score });
                    } else {
                        return ({ player: `<@${p.player}>`, score: p.score });
                    }

                });


                interaction.channel.send({ embeds: [new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setTitle(`\`${song.name}\` - \`${song.artist.toString().replace(/,/g, ', ')}\``)
                    .setURL(psong.url)
                    .setDescription(`\`${psong.views.toLocaleString()} 👀 | ${psong.likes.toLocaleString()} 👍 | ${psong.durationRaw} | 🔉 100%\``)
                    .setThumbnail(psong.thumbnails[0].url)
                    .addFields({ name: 'Scoreboard', value: textScoreboard.map(player => `${player.player} - ${player.score} pts`).toString().replace(/,/g, '\n') })
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
            <@${scoreboard[0].player}> has won with **${scoreboard[0].score} points**!`)
            .addFields({ name: 'Scoreboard', value: textScoreboard.map(player => `${player.player} - ${player.score} pts`).toString().replace(/,/g, '\n') })
        ] });
        
    }
}
