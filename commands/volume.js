const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'volume',
    helpname: 'Volume',
    aliases: [],
    aliasesText: '',
    description: 'Set the volume of the music bot.',
    usage: 'Volume [0-1000]',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: true,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.config)
        if (!client.distube.getQueue(message)) return message.channel.send({ embeds: [embed.setDescription(`There is nothing playing right now.`)] })
        if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) <= 0 || parseInt(args[0]) >= 1000) return message.channel.send({ embeds: [embed.setDescription(`Please provide a volume between 0 and 1000.`)] })
        client.distube.setVolume(message, parseInt(args[0]))
        message.channel.send({ embeds: [embed.setDescription(`The volume has been set to ${args[0]}%.`)] })
    }
}