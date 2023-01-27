const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['commands', 'cmd', 'cmds'],
    description: 'Help command.',
    category: 'info',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let row = new ActionRowBuilder();
        let categories = [];

        client.commands.map(cmd => { !categories.includes(cmd.category) && categories.push(cmd.category); });
        categories.map(category => { row.addComponents(new ButtonBuilder().setStyle('Primary').setLabel(category.capitalize()).setCustomId(category)); });

        interaction.editReply({ embeds: [embed.setDescription('Choose a category to show help from.')], components: [row] }).then(msg => {

            const filter = (button) => button.member.id === interaction.member.id;

            msg.awaitMessageComponent({ filter, time: 30000, errors: ['time'] }).then(button => {

                let category = button.customId;

                client.commands.filter(cmd => cmd.category === category).map(cmd => {

                    let aliases = '';
                    if (!cmd.aliases) aliases = ' ';
                    else cmd.aliases.map(a => {

                        if (cmd.aliases[cmd.aliases.length - 1] === a) return aliases += a.capitalize();
                        else return aliases += a.capitalize() + ', ';

                    });

                    embed.addFields({ name: `**${cmd.name.capitalize()}**`, value:`
                        
                    ${cmd.description}
                    Aliases: \`${aliases}\`\n\n`, inline: true });
                
                });

                interaction.editReply({ embeds: [embed.setTitle(category.capitalize()).setDescription(null)], components: [] });

            }).catch(e => { interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

        });
        
    }
}