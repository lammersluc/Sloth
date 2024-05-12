import { Client, ChatInputCommandInteraction, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        const categories = client.categories.filter((_, key) => key !== 'hidden');

        const buttons = [
            new ButtonBuilder().setLabel('⬅️').setCustomId('previous').setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setLabel('➡️').setCustomId('next').setStyle(ButtonStyle.Secondary)
        ]
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

        let selectedIndex = 0;
        let button;

        while (true) {

            const key = categories.keyAt(selectedIndex)!.capitalize();
            const category = categories.at(selectedIndex)!;

            embed.setFields([]);

            if (category.length === 0) embed.addFields({ name: 'No commands found.', value: 'This category is empty.' });
            else {
                embed.addFields(category.map(cmd => {
                    const command = client.commands.get(cmd)!;
                    return { name: `**${command.data.name.capitalize()}**`, value: `\`\`\`${command.data.description}\`\`\``, inline: true };
                }));
            }

            if (selectedIndex === 0) buttons[0].setDisabled(true);
            else buttons[0].setDisabled(false);

            if (selectedIndex === categories.size - 1) buttons[1].setDisabled(true);
            else buttons[1].setDisabled(false);

            const msg = await interaction.editReply({ embeds: [embed.setTitle(key).setFooter({ text: `${selectedIndex + 1}/${categories.size}` })], components: [row] });

            button?.update({});

            const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
            button = await msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 }).catch(() => null);

            if (!button) return await interaction.editReply({ components: [] });

            if (button.customId === 'previous') selectedIndex--;
            else if (button.customId === 'next') selectedIndex++;
        }
    }
}