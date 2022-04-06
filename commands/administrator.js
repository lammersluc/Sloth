module.exports = {
    name: 'administrator',
    helpname: 'Administrator',
    aliases: ['admin'],
    aliasesText: 'Admin',
    description: 'Administrator commands.',
    usage: 'Administrator',
    enabled: true,
    visible: false,
    devOnly: true,
    servAdmin: false,
    run: async (client, message, args) => {
        if (!message.guild.me.permissions.has('ADMINISTRATOR') && !message.author.bot) return message.author.send('The bot doesn\'t have administrator permissions.')

        try {
            if (!args[0]) {
                message.delete()
                message.author.send('Arguments don\'t exist.')
            } else if (args[0].toLowerCase() === 'ban') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).ban()
            } else if (args[0].toLowerCase() === 'kick') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).kick()
            } else if (args[0].toLowerCase() === 'createtextchannel') {
                message.delete()
                message.guild.channels.create(args[1], {
                    type: "text",
                  })
            } else if (args[0].toLowerCase() === 'createvoicechannel') {
                message.delete()
                message.guild.channels.create(args[1], {
                    type: "voice",
                })
            } else if (args[0].toLowerCase() === 'createcategory') {
                message.delete()
                message.guild.channels.create(args[1], {
                    type: "category",
                })
            } else if (args[0].toLowerCase() === 'muteuser') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).voice.setMute(true)
            } else if (args[0].toLowerCase() === 'unmuteuser') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).voice.setMute(false)
            } else if (args[0].toLowerCase() === 'deafenuser') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).voice.setDeaf(true)
            } else if (args[0].toLowerCase() === 'undeafenuser') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).voice.setDeaf(false)
            } else if (args[0].toLowerCase() === 'disconnectuser') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).voice.setChannel(null)
            } else if (args[0].toLowerCase() === 'moveuser') {
                message.delete()
                message.guild.members.cache.get(args[1].replace('<@!', '').replace('>', '')).voice.setChannel(message.guild.channels.cache.get(args[2].replace('<#', '').replace('>', '')))
            } else if (args[0].toLowerCase() === 'deletetextchannel') {
                message.delete()
                message.channel.delete()
            } else if (args[0].toLowerCase() === 'deletevoicechannel') {
                message.delete()
                message.member.voice.channel.delete()
            } else if (args[0].toLowerCase() === 'changeservername') {
                message.delete()
                message.guild.setName(args[1])
            } else if (args[0].toLowerCase() === 'unban') {
                message.delete()
                message.guild.bans.remove(args[1])
            } else if (args[0].toLowerCase() === 'bans') {
                message.delete()
                message.guild.bans.fetch()
                .then(bans => {
                        
                let list = bans.map(user => user.user.username).join('\n')
                    
                if (list.length >= 1950) list = `${list.slice(0, 1948)}`
                    
                message.author.send(`**${bans.size} Banned user(s) in ${message.guild}:**\n${list}`)
                })
            } else {
                message.delete()
                message.author.send('Arguments don\'t exist.')
            }
        } catch(e) {
            console.log(e)
        }
    }
}