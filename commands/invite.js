module.exports = {
    name: 'invite',
    helpname: 'Invite',
    aliases: [],
    aliasesText: '',
    description: 'Creates or shows invite for the server.',
    usage: 'Invite',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        
        const invites = await message.guild.invites.fetch()

        invites.forEach(invite => {
            if (invite.inviter === '900108739372265512') {
                return message.channel.send(`Invite: ${invite.url}`)
            }
        })
        
        message.guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT').createInvite({
            maxAge: 0,
            maxUses: 0
        }).then(invite => {
            message.channel.send(`Invite: ${invite.url}`)
        })
    }
}