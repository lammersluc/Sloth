import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses/Resumes the playback.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = useQueue(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });


        if (queue.node.isPaused()) {
            queue.node.resume();
            return interaction.editReply({ embeds: [embed.setDescription('The song has been resumed.')] });
        }

        queue.node.pause();
        interaction.editReply({ embeds: [embed.setDescription('The song has been paused.')] });
    }
}