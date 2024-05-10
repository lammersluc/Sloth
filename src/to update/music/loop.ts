import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Enables/Disables loop mode.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = client.queue.get(interaction.guildId);
        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        queue.loop = !queue.loop;

        interaction.editReply({ embeds: [embed.setDescription(`Switched the loop mode to \`${queue.loop}\`.`)] });
    }
}
