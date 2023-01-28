const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    category: 'music',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription(`There is nothing in the queue right now.`)] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        queue.shuffle();

        interaction.editReply({ embeds: [embed.setDescription('Shuffled the songs in queue.')] });
        
    }
}