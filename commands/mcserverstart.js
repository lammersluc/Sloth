const { MessageEmbed } = require('discord.js')
const { tcpPingPort } = require('tcp-ping-port')
const pm2 = require('pm2')

module.exports = {
    name: 'mcserverstart',
    helpname: 'MC Server Start',
    aliases: ['mcss'],
    aliasesText: ' ',
    description: 'Starts the mc server.',
    usage: 'mcserverstart',
    enabled: true,
    visible: false,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)
        const ping = await tcpPingPort('mc.nottrackz.me', 25565)
        if (ping.online) return message.channel.send({ embeds: [embed.setDescription('The server is already online.')] })
        message.channel.send({ embeds: [embed.setDescription('Starting server...')] })
        pm2.restart('MCServer')
    }
}