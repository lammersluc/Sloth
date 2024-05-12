import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, type Command, ButtonStyle, ButtonInteraction, ButtonComponent, ComponentType } from 'discord.js';

enum Choices {
    Rock = '🪨',
    Paper = '📰',
    Scissors = '✂'
}

export default {
    data: new SlashCommandBuilder()
        .setName('rockpaperscissors')
        .setDescription('Play rock paper scissors with the bot'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);
        const row = new ActionRowBuilder<ButtonBuilder>();

        Object.values(Choices).forEach((choice: string) => {
            row.addComponents(new ButtonBuilder().setLabel(choice).setCustomId(choice).setStyle(ButtonStyle.Secondary));
        });

        const msg = await interaction.editReply({ embeds: [embed.setDescription('Rock, Paper, or Scissors?')], components: [row] });

        const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
        const button = await msg.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 }).catch(() => null);

        if (!button) return interaction.editReply({ embeds: [embed.setDescription('You did not choose in time.')], components: [] });

        const playerChoice = button.customId;
        const botChoice = Object.values(Choices)[Math.floor(Math.random() * Object.keys(Choices).length)];

        if (playerChoice === botChoice)
            return interaction.editReply({ embeds: [embed.setDescription(`You chose \`${playerChoice}\` and the bot chose \`${botChoice}\`. It's a draw!`)], components: [] });
        
        if ((playerChoice === Choices.Rock && botChoice === Choices.Scissors) || (playerChoice === Choices.Paper && botChoice === Choices.Rock) || (playerChoice === Choices.Scissors && botChoice === Choices.Paper))
            return interaction.editReply({ embeds: [embed.setDescription(`You chose \`${playerChoice}\` and the bot chose \`${botChoice}\`. You win!`)], components: [] });
            
        interaction.editReply({ embeds: [embed.setDescription(`You chose \`${playerChoice}\` and the bot chose \`${botChoice}\`. You lose!`)], components: [] });
    }
}