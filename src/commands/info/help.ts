import { Client, ChatInputCommandInteraction, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        const categories = client.categories.filter((_, key) => key !== 'dev');

        const buttons = [
            new ButtonBuilder().setLabel('⬅️').setCustomId('previous').setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setLabel('➡️').setCustomId('next').setStyle(ButtonStyle.Secondary)
        ]
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

        const firstKey = categories.firstKey();

        if (!firstKey) return await interaction.editReply({ embeds: [embed.setDescription('No commands found.')], components: [] });

        categories.first()?.forEach((cmd: string) => {
            const command = client.commands.get(cmd);

            if (!command) return;

            embed.addFields({ name: `**${command.data.name.capitalize()}**`, value: command.data.description, inline: true })
        });

        const msg = await interaction.editReply({ embeds: [embed.setTitle(firstKey.capitalize())], components: [row] });

        let selectedIndex = 0;

        while (true) {
            const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
            const button = await msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 }).catch(() => null);

            if (!button) return await interaction.editReply({ components: [] });

            if (button.customId === 'previous') selectedIndex--;
            else if (button.customId === 'next') selectedIndex++;

            const key = categories.keyAt(selectedIndex)!.capitalize();
            const category = categories.at(selectedIndex)!;

            embed.setFields([]);

            embed.addFields(category.map((cmd) => {
                const command = client.commands.get(cmd)!;

                return { name: `**${command.data.name.capitalize()}**`, value: command.data.description, inline: true };
            }));

            if (selectedIndex === 0) buttons[0].setDisabled(true);
            else buttons[0].setDisabled(false);

            if (selectedIndex === categories.size - 1) buttons[1].setDisabled(true);
            else buttons[1].setDisabled(false);

            await button.update({ embeds: [embed.setTitle(key)], components: [row] });
        }
    }
}