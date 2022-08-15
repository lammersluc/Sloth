const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'seek',
    helpname: 'Seek',
    aliases: [],
    aliasesText: ' ',
    description: 'Seek to a specific time in the current song.',
    usage: 'Seek [Time in seconds]',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(message);
        if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing right now')] });

        if (!args[0] || isNaN(parseInt(args[0]))) return message.channel.send({ embeds: [embed.setDescription('Please specify a time in seconds.')] });
        if (parseInt(args[0]) < 0) return message.channel.send({ embeds: [embed.setDescription('Please specify a time in seconds greater than 0.')] });
        if (parseInt(args[0]) > queue.songs[0].duration) return message.channel.send({ embeds: [embed.setDescription('The time specified is longer than the song\'s duration.')] });

        queue.seek(parseInt(args[0]));
        message.channel.send({ embeds: [embed.setDescription(`Seeked to ${args[0]} seconds.`)] });
    }
}