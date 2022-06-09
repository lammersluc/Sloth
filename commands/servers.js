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
        let embed = new MessageEmbed()
            .setColor(client.embedColor)
            .setTitle(`${client.user.username}'s Servers`)
            .setDescription(`${client.guilds.cache.size} Servers\n${client.users.cache.size} Users`)
            .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })


        client.guilds.cache.map(async g => {
            if (g.me.permissions.has('ADMINISTRATOR') || g.me.permissions.has('MANAGE_GUILD')) {
                const invites = await g.invites.fetch()

                if(invites.first()) invite = invites.first().url
                else invite = 'No Invite'
            } else invite = 'No Invite'

                embed.addField(g.name, `${g.memberCount} Members\n${invite}`)
        })
        
        message.author.send({ embeds: [embed] })

    }
}