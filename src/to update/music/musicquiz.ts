import { Client, ChatInputCommandInteraction, EmbedBuilder, GuildMember, Message, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import play from 'play-dl';
import fs from 'fs';

import { similarity, sleep } from '../../utils';

type Player = {
    player: string;
    score: number;
};

export default {
    data: new SlashCommandBuilder()
        .setName('musicquiz')
        .setDescription('Starts a music quiz.')
        .addIntegerOption(option =>
            option.setName('rounds')
                .setDescription('Number of rounds for the music quiz.')
                .setRequired(true)
                .setMinValue(3)
                .setMaxValue(100)),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);
        let rounds = interaction.options.getInteger('rounds')!;

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (!(interaction.channel instanceof TextChannel) || !(interaction.member?.permissions as PermissionsBitField).has(PermissionsBitField.Flags.SendMessages)) return interaction.editReply({ embeds: [embed.setDescription('I need permissions to send messages in this channel in order to play a music quiz.')] });
        if (!(interaction.member as GuildMember).voice.channelId) return interaction.editReply({ embeds: [embed.setDescription('You are not in a voice channel.')] });
        if (client.queue.get(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am already playing music.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('A music quiz is already in progress.')] });

        client.musicquiz.push(interaction.guildId);

        const startMsg = await interaction.editReply({ embeds: [embed
            .setTitle('Music Quiz')
            .setDescription(`
The music quiz is starting soon...

* You have **30 seconds** to guess each song.
* There are **${rounds} rounds**.
* If you don't know a song you can type \`pass\`.
* You can stop the quiz at any time by typing \`stopquiz\`.

Click on the emoji below to join the quiz.`)
            .addFields(
                { name: 'Points', value: '\`\`\`markdown\n+ 1 point for the song name\n+ 1 point for the artist name\n+ 1 point for both\`\`\`' },
            )
        ]});

        let players: string[] = [];

        await startMsg.react('🙋‍♂️');

        await new Promise<void>((resolve) => {
            startMsg.awaitReactions({ time: 15000 }).then(collected => {
                collected.forEach(r => r.users.cache.forEach(u => !u.bot && players.push(u.id)));
                startMsg.reactions.removeAll();
                resolve();
            });
        });

        if (players.length < 1) {
            interaction.editReply({ embeds: [embed.setDescription('Not enough players.').setFields()] });
            startMsg.reactions.removeAll();
            return client.musicquiz.splice(client.musicquiz.indexOf(interaction.guildId), 1);
        }

        let round = 0;
        let played: number[] = [];

        let scoreboard = players.map(p => { return { player: p, score: 0 }});
        let textScoreboard: Player[] = [];

        let connection = joinVoiceChannel({
            channelId: (interaction.member as GuildMember).voice.channelId!,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
            selfDeaf: true
        });

        let player = createAudioPlayer();
        let resource = createAudioResource('./src/ext/countdown.mp3');

        player.play(resource);
        connection.subscribe(player);

        let data = JSON.parse(fs.readFileSync('./src/ext/spotify.json').toString());
        const tracks = data[0].tracks;

        while (round < rounds) {
            let roundfinished = false;
            let tGuessed = '';
            let aGuessed = '';
            let passVotes: string[] = [];

            let song;
            let random = Math.floor(Math.random() * tracks.length);
            let title;
            let artists = [];

            let search;
            let stream;

            while (true) {
                while (played.includes(random)) random = Math.floor(Math.random() * tracks.length);
                song = tracks[random];
                title = song.name.split(/[-]/)[0].replace(/\([^()]*\)/g, '').trim().toLowerCase();
                played.push(random);

                if (song.artist.constructor === Array) song.artist.forEach((a: string) => artists.push(a.toLowerCase()));
                else artists.push(song.artist.toLowerCase());

                search = (await play.search(`${title} ${artists.join(' ')} official`))[0];

                try {
                    stream = await play.stream(search.url, { seek: Math.floor(search.durationInSec / 3), quality: 2 });
                } catch(e) {
                    continue;
                }

                break;
            }

            let resource = createAudioResource(stream.stream, {
                inputType: stream.type,
            });
            
            player.play(resource);
            connection.subscribe(player);

            const filter = (m: Message) => players.includes(m.author.id);
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', async m => {
                if (m.content.toLowerCase() === 'stopquiz') {
                    m.react('🔴');
                    rounds = round + 1;
                    return collector.stop();
                }

                if (m.content.toLowerCase() === 'pass' && !passVotes.includes(m.author.id)) {
                    passVotes.push(m.author.id);
                    m.react('⏭️');

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

                interaction.channel?.send({ embeds: [new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setTitle(`\`${song.name}\` - \`${song.artist.toString().replace(/,/g, ', ')}\``)
                    .setURL(search.url)
                    .setDescription(`\`${search.views.toLocaleString()} 👀 | ${search.durationRaw} | ${search.uploadedAt}\``)
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
            .setTitle('Music Quiz')
            .setDescription(`The music quiz has ended.\n${scoreboard.length === 1 || scoreboard[0].score !== scoreboard[1].score ? `<@${scoreboard[0].player}> has won with **${scoreboard[0].score} points**!` : `It's a tie between${scoreboard.map(p => p.score === scoreboard[0].score && ` <@${p.player}>`)} with **${scoreboard[0].score} points**!`}\n`)
            .addFields({ name: 'Scoreboard', value: textScoreboard.map(p => `${p.player} - ${p.score} pts`).toString().replace(/,/g, '\n') })
        ] });
    }
}
