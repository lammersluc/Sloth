import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current song.')
        .addIntegerOption(o => o
            .setName('time')
            .setDescription('Enter the time to seek to in seconds')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = useQueue(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const track = queue.currentTrack!;
        let time = interaction.options.getInteger('time')!;

        if (time < 0) time = 0;
        else if (time > (track.durationMS / 1000 - 5)) time = track.durationMS / 1000 - 5;


        await queue.node.seek(time)
        interaction.editReply({ embeds: [embed.setDescription(`Seeked to ${time} seconds in the current track.`)] });
    }
}