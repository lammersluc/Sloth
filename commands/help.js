const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'help',
    helpname: 'Help',
    aliases: ['commands', 'cmd', 'cmds'],
    aliasesText: 'Commands, Cmd, Cmds',
    description: 'Help command.',
    usage: 'Help',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let commands = ''
        client.commands.map(cmd => {
            if (cmd.visible) {
                commands += `**${cmd.helpname}**\n${cmd.description}\n*Usage\: ${client.prefix + cmd.usage}\nAliases: ${cmd.aliasesText}*\n\n`
            }
        })

        message.channel.send({embeds: [
            new MessageEmbed().setDescription(commands)
        ]})
    }
}