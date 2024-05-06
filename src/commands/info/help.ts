import { Client, ChatInputCommandInteraction, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        const buttons = client.categories.map((_: any, category: string) => new ButtonBuilder()
            .setLabel(category)
            .setCustomId(category)
            .setStyle(ButtonStyle.Primary)
        );
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

        const msg = await interaction.editReply({ embeds: [embed.setTitle('Select a Category').setDescription('Choose a category to show help from.')], components: [row] });

        const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
        const button = await msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 }).catch(() => null);

        if (!button) return await interaction.editReply({ embeds: [embed.setDescription('You did not select a category in time.')], components: [] });

        const selectedCategory = button.customId;

        client.categories.get(selectedCategory)?.forEach((cmd: string) => {
            const command = client.commands.get(cmd);

            if (!command) return;

            embed.addFields({ name: `**${command.data.name.capitalize()}**`, value: command.data.description, inline: true })
        });

        await interaction.editReply({ embeds: [embed.setTitle(selectedCategory.capitalize()).setDescription(null)], components: [] });
    }
}