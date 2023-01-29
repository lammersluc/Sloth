const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'random',
    description: 'Chooses a randum number between 1 and the argument.',
    category: 'tools',
    options: [{ name: 'max', forced: true }],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        let max = parseInt(interaction.options.getString('max'));
        let random = Math.round(Math.random() * max + 1);

        interaction.editReply({ embeds: [embed.setDescription(`A random number between 1 and ${max} is \`${random}\`.`)] });
        
    }
}