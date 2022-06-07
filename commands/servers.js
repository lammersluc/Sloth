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
        let invite = ''

        client.guilds.cache.map(async g => {
            const invites = await g.invites.fetch()

            if(invites.first()) invite = invites.first().url
            else invite = 'No Invite'

            message.author.send({ embeds: [new MessageEmbed().setColor(client.embedColor).addField(g.name, `${g.memberCount} Members\n${invite}`)] })
        })

    }
}