const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'dm',
    helpname: 'DM',
    aliases: ['directmessage'],
    aliasesText: 'Directmessage',
    description: 'Get a \'hi\' in you direct message.',
    usage: 'DM',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        message.author.send({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription('Hi!')] })
    }
}