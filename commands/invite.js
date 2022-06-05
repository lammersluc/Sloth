const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'invite',
    helpname: 'Invite',
    aliases: [],
    aliasesText: ' ',
    description: 'Creates or shows invite for the server.',
    usage: 'Invite',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)
        const invites = await message.guild.invites.fetch()

        invites.forEach(invite => {
            if (invite.inviter === client.user.id) {
                return message.channel.send({ embeds: [embed.setDescription(`Invite: ${invite.url}`)] })
            }
        })
        
        message.guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT').createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
            message.channel.send({ embeds: [embed.setDescription(`Invite: ${invite.url}`)] })
        })
    }
}