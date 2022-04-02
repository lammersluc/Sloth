const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'penis',
    helpname: 'Penis',
    aliases: ['pp'],
    aliasesText: 'PP',
    description: 'Gives a random pp size',
    usage: 'Penis',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {

        message.channel.send({embeds: [
            new MessageEmbed().setDescription(`${message.author} pp size:\n\nO\n${new Array(Math.floor(Math.random() * 49 + 1)).fill('=').join('')}|)\nO`)
        ]})
    }
}