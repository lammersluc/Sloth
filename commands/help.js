const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    helpname: 'Help',
    aliases: ['commands', 'cmd', 'cmds'],
    aliasesText: 'Commands, Cmd, Cmds',
    description: 'Help command.',
    category: 'info',
    usage: 'Help',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor);
        let row = new ActionRowBuilder();
        let categories = [];
        client.commands.map(cmd => {
            if (!categories.includes(cmd.category)) {
                categories.push(cmd.category);
            }
        });

        categories.map(category => {
            let categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            row.addComponents(new ButtonBuilder().setStyle('Primary').setLabel(categoryName).setCustomId(category));
        });

        message.channel.send({ embeds: [embed.setDescription('Choose a category to show help from.')], components: [row] }).then(msg => {
            const filter = (button) => button.user.id === message.author.id;
            msg.awaitMessageComponent({ filter, time: 30000, errors: ['time'] }).then(button => {
                let category = button.customId;
                let commands = client.commands.filter(cmd => cmd.category === category);
                let cmdText = '';
                commands.map(cmd => {
                    cmdText += `**${cmd.helpname}**\n${cmd.description}\nUsage\: \`${client.prefix + cmd.usage}\`\nAliases: \`${cmd.aliasesText}\`\n\n`
                });
                embed.setTitle(category.charAt(0).toUpperCase() + category.slice(1));
                embed.setDescription(cmdText);
                msg.edit({ embeds: [embed], components: [] });
            }).catch(() => {
                msg.edit({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] });
            });
        });
    }
}