import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Chooses a random number between 1 and the max.')
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('Enter the maximum value for the random number')
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);
        const max = interaction.options.getInteger('max')!;
        const random = Math.floor(Math.random() * max + 1);

        interaction.editReply({ embeds: [embed.setDescription(`A random number between 1 and ${max} is \`${random}\`.`)] });
    }
}