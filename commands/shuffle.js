const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'shuffle',
    helpname: 'Shuffle',
    aliases: [],
    aliasesText: '',
    description: 'Shuffles the queue.',
    usage: 'Shuffle',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send({ embeds: [embed.setDescription(`There is nothing in the queue right now.`)] })
        queue.shuffle()
        message.channel.send({ embeds: [embed.setDescription('Shuffled songs in the queue.')] })
    }
}