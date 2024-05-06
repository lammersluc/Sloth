import { ChatInputCommandInteraction, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ModalSubmitInteraction, ModalBuilder, ComponentType, type APIActionRowComponent, type MessageActionRowComponentBuilder, Collection } from "discord.js";
import type { Command } from "../../utils";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command.'),
    async execute(client: any, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        const buttons = client.categories.map((_: any, category: string) => new ButtonBuilder()
            .setLabel(category)
            .setCustomId(category)
            .setStyle(ButtonStyle.Primary)
        );
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

        await interaction.editReply({ embeds: [embed.setTitle('Select a Category').setDescription('Choose a category to show help from.')], components: [row] });

        const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
        const buttonInteraction = await interaction.channel?.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 });

        if (!buttonInteraction) return await interaction.editReply({ embeds: [embed.setDescription('You did not select a category in time.')] });

        const selectedCategory = buttonInteraction?.customId;

        client.categories.get(selectedCategory).forEach((cmd: string) => {
            const command: Command = client.commands.get(cmd);

            embed.addFields({ name: `**${command.data.name.capitalize()}**`, value: command.data.description, inline: true })
        });

        await interaction.editReply({ embeds: [embed.setTitle(selectedCategory.capitalize()).setDescription(null)], components: [] });
    }
}
