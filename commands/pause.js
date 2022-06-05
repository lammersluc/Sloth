const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'pause',
    helpname: 'Pause',
    aliases: ['p'],
    aliasesText: 'P',
    description: 'Pauses/Resumes the current song.',
    usage: 'Pause',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.config)
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing right now.')] })
        if (queue.paused) {
            queue.resume()
            return message.channel.send({ embeds: [embed.setDescription('The song has been resumed.')] })
        }
        queue.pause()
        message.channel.send({ embeds: [embed.setDescription('The song has been paused.')] })
    }
}