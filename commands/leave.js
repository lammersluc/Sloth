const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leave',
    helpname: 'Leave',
    aliases: ['l' ,'stop'],
    aliasesText: 'L, Stop',
    description: 'Makes the bot leave voice channel.',
    category: 'music',
    usage: 'Leave',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (!client.distube.getQueue(message)) return message.channel.send({ embeds: [embed.setDescription('The bot is not connected to any voice channel.')] });

        client.distube.voices.leave(message);
        
        message.channel.send({ embeds: [embed.setDescription('The bot has left the voice channel.')] });
        
    }
}