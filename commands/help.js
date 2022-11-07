const { EmbedBuilder } = require('discord.js');

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
    adminOnly: false,
    run: async (client, message, args) => {
        let commands = ''
        client.commands.map(cmd => {
            if (cmd.visible) {
                commands += `**${cmd.helpname}**\n${cmd.description}\nUsage\: \`${client.prefix + cmd.usage}\`\nAliases: \`${cmd.aliasesText}\`\n\n`
            }
        });

        message.channel.send({ embeds: [
            new EmbedBuilder()
            .setColor('#00a8f3')
            .setTitle('Help Menu')
            .setDescription(commands)
            .setColor(client.embedColor)
        ]});
    }
}