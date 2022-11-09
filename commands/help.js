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

        client.commands.map(cmd => { !categories.includes(cmd.category) && categories.push(cmd.category); });
        categories.map(category => { row.addComponents(new ButtonBuilder().setStyle('Primary').setLabel(category.capitalize()).setCustomId(category)); });

        message.channel.send({ embeds: [embed.setDescription('Choose a category to show help from.')], components: [row] }).then(msg => {
            const filter = (button) => button.user.id === message.author.id;
            msg.awaitMessageComponent({ filter, time: 30000, errors: ['time'] }).then(button => {
                let category = button.customId;

                client.commands.filter(cmd => cmd.category === category).map(cmd => {
                    embed.addFields({ name: `**${cmd.helpname}**`, value: `${cmd.description}\nUsage\: \`${client.prefix + cmd.usage}\`\nAliases: \`${cmd.aliasesText}\`\n\n`, inline: true });
                });

                msg.edit({ embeds: [embed.setTitle(category.capitalize()).setDescription(null)], components: [] });

            }).catch(e => { msg.edit({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

        });
        
    }
}