module.exports = {
    name: 'administrator',
    aliases: ['admin'],
    aliasesText: 'Admin',
    description: 'Administrator commands.',
    usage: 'Administrator',
    enabled: true,
    devOnly: true,
    servAdmin: false,
    run: async (client, message, args) => {
        try {
            if (args[0].toLowerCase() === 'ban') {
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
            }
        } catch(e) {
            console.log(e)
        }
    }
}