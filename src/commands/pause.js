const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    helpname: 'Pause',
    aliases: ['p'],
    aliasesText: 'P',
    description: 'Pauses/Resumes the current song.',
    category: 'music',
    usage: 'Pause',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(message);

        if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz) return message.channel.send({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        if (queue.paused) { queue.resume(); return message.channel.send({ embeds: [embed.setDescription('The song has been resumed.')] }); }
        else { queue.pause(); message.channel.send({ embeds: [embed.setDescription('The song has been paused.')] }); }
        
    }
}