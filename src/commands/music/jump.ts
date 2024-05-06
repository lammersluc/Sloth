import { ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { VoiceConnectionStatus, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import play from 'play-dl';

import type { Queue } from "../../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jumps to a song in the queue.'),
    async execute(client: any, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);
        const embed2 = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        if (queue.songs.length <= 1) return interaction.editReply({ embeds: [embed.setDescription('There is nothing to jump to.')] });

        const q = (queue as Queue).songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${song.title}\` - \`${song.durationRaw}\``)
            .join('\n');

        interaction.editReply({ embeds: [embed
            .setTitle('**Which song do you want to jump to?**')
            .setDescription(q)
        ]}).then(async () => {
            const filter = (m: Message) => m.author.id === interaction.user.id;

            interaction.channel?.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async collected => {
                let position = parseInt(collected.first()?.content || '');

                if (isNaN(position) || position < 1 || position > queue.songs.length) return interaction.editReply({ embeds: [embed2.setDescription('Please provide a valid position.')] });

                client.queue.get(interaction.guildId).songs = queue.songs.slice(position);

                const connection = getVoiceConnection(interaction.guildId as string);
                if (connection?.state.status !== VoiceConnectionStatus.Ready) return interaction.editReply({ embeds: [embed2.setDescription('I am not playing anything right now.')] });
                const player = connection.state.subscription?.player;

                const stream = await play.stream(queue.songs[0].url, { quality: 2 });

                const resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                });

                player?.play(resource);

                interaction.editReply({ embeds: [embed2.setDescription(`Jumped to song position \`${position}\` in the queue.`)] });
            });
        }).catch(() => interaction.editReply({ embeds: [embed2.setDescription('You didn\'t choose anything after 30 seconds.')] }));
    }
}
