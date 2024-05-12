import { useQueue } from 'discord-player';
import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to the next song.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = useQueue(interaction.guildId);
        
        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        interaction.editReply({ embeds: [embed.setDescription(queue.node.skip() ? 'Skipped.' : 'There is nothing to skip to.')] });
    }
}