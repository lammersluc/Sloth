const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'random',
    helpname: 'Random',
    aliases: ['rng'],
    aliasesText: 'Rng',
    description: 'Chooses a randum number between 1 and the argument.',
    usage: 'Random [Max output]',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)
        let random = Math.round(Math.random() * args[0] + 1)

        if(!args[0]) return message.channel.send({ embeds: [embed.setDescription('Provide a number.')] })
        if (isNaN(random)) return message.channel.send({ embeds: [embed.setDescription('Provide a valid number.')] })

        message.channel.send({ embeds: [embed.setDescription(`A random number between 1 and ${args[0]} is ${random}`)] })
    }
}