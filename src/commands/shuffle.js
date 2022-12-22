const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    helpname: 'Shuffle',
    aliases: [],
    aliasesText: ' ',
    description: 'Shuffles the queue.',
    category: 'music',
    usage: 'Shuffle',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(message);

        if (!queue) return message.channel.send({ embeds: [embed.setDescription(`There is nothing in the queue right now.`)] });
        if (client.musicquiz) return message.channel.send({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        queue.shuffle();

        message.channel.send({ embeds: [embed.setDescription('Shuffled songs in the queue.')] });
        
    }
}