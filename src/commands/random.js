const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'random',
    description: 'Chooses a randum number between 1 and the argument.',
    category: 'tools',
    options: [{ name: 'max', type: 'integer', minValue: 1, required: true }],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        let max = interaction.options.getInteger('max');
        let random = Math.round(Math.random() * (max -1) + 1);

        interaction.editReply({ embeds: [embed.setDescription(`A random number between 1 and ${max} is \`${random}\`.`)] });
        
    }
}