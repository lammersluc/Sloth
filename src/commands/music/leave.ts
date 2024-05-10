import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useQueue } from "discord-player";

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Makes the bot leave voice channel.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guild) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guild.id)) return interaction.editReply({ embeds: [embed.setDescription('You can\'t use this command while a music quiz is running. Type stop \`stopquiz\` instead')] });

        const queue = useQueue(interaction.guild.id);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        
        queue.node.stop();
        interaction.editReply({ embeds: [embed.setDescription('The bot has left the voice channel.')] });
    }
}