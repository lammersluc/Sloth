import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, type Command, ButtonStyle, ButtonInteraction, ButtonComponent, ComponentType } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rockpaperscissors')
        .setDescription('Play rock paper scissors with the bot.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);
        const emojis = ['🪨', '📰', '✂'];
        const row = new ActionRowBuilder<ButtonBuilder>();

        emojis.forEach(emoji => {
            row.addComponents(new ButtonBuilder().setLabel(emoji).setStyle(ButtonStyle.Secondary).setCustomId(emoji));
        });

        const msg = await interaction.editReply({ embeds: [embed.setDescription('Rock, Paper, or Scissors?')], components: [row] });

        const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
        const button = await msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 }).catch(() => null);

        if (!button) return interaction.editReply({ embeds: [embed.setDescription('You did not choose in time.')], components: [] });

        const emoji = button.customId;
        const playerChoice = emojis.indexOf(emoji);
        const botChoice = Math.floor(Math.random() * 3);

        if (playerChoice === botChoice)
            interaction.editReply({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice]}\` and the bot chose \`${emojis[botChoice]}\`. It's a draw!`)], components: [] });
        else if ((playerChoice === 0 && botChoice === 2) || (playerChoice === 1 && botChoice === 0) || (playerChoice === 2 && botChoice === 1))
            interaction.editReply({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice]}\` and the bot chose \`${emojis[botChoice]}\`. You win!`)], components: [] });
        else
            interaction.editReply({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice]}\` and the bot chose \`${emojis[botChoice]}\`. You lose!`)], components: [] });
    }
}