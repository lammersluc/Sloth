const {MessageEmbed, Client} = require('discord.js')

module.exports = {
    name: 'help',
    aliases: ['commands'],
    aliasesText: 'Commands',
    description: 'Help command.',
    usage: 'Help',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let commands = ''
        client.commands.map(cmd => {
            commands += `**${cmd.name.capitalize()}**\n${cmd.description}\n*Usage\: ${client.prefix + cmd.usage}\nAliases: ${cmd.aliasesText}*\n\n`
        })

        message.channel.send({embeds: [
            new MessageEmbed().setDescription(commands)
        ]})
    }
}