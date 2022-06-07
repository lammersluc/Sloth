const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'servers',
    helpname: 'Servers',
    aliases: [],
    aliasesText: ' ',
    description: 'Sends DM Message of list with servers the bot is in.',
    usage: 'Servers',
    enabled: true,
    visible: false,
    devOnly: true,
    servAdmin: false,
    run: async (client, message, args) => {
        message.delete()
        let embed = new MessageEmbed().setColor(client.embedColor)
        let serverList = ''
        
        client.guilds.cache.map(async g => {

            const invites = await g.invites.fetch()
            if (invites) {
                let invite = invites.first().url
            }

            embed.addField(g.name, `${g.memberCount} Members\n${invite}`)
        })

        message.author.send({ embeds: [embed.setTitle('Servers').setDescription(serverList)] })
    }
}