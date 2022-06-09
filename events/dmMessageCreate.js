const { MessageEmbed } = require("discord.js")

module.exports = async (client, message) => {
    if (message.author.id === client.user.id) return
    let embed = new MessageEmbed().setColor(client.embedColor)
    const guild = client.guilds.cache.get('971056840123252736')
    const tickets = guild.channels.cache.get('984118604805050398')
    const channel = guild.channels.cache.find(c => c.name == `${message.author.username.toLowerCase().replace(' ', '-')}-${message.author.id}`)

    if (channel) return channel.send(message.content)

    message.channel.send({ embeds: [embed.setDescription(`Thanks for opening a support ticket ${message.author}. We will try to respond to this message as soon as possible.`)] })
    guild.channels.create(`${message.author.username}-${message.author.id.toLowerCase().replace(' ', '-')}`, 'text').then(channel => {
        channel.setParent(tickets)
        channel.send({ embeds: [embed.setDescription(`This ticket was created by ${message.author}.`)] })
        channel.send(message.content)
    })
}