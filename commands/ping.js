const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'ping',
    helpname: 'Ping',
    aliases: ['delay'],
    aliasesText: 'Delay',
    description: 'Ping to test delay.',
    usage: 'Ping',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)
        message.channel.send({embeds: [embed.setDescription('Pinging...')]}).then(msg => {
            msg.edit({ embeds: [embed.setDescription(`Pong. The response time is ${msg.createdTimestamp - message.createdTimestamp}ms. The API latency is ${Math.round(client.ws.ping)}ms.`)] })
        })
    }
}