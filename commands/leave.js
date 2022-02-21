const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    aliases: ['l' ,'stop', 's'],
    description: 'Makes the bot leave voice channel',
    usage: 'Leave',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {

        const connection = getVoiceConnection(message.member.guild.id)

        try {
            message.member.guild.me.edit({servermute:false})
            
            connection.destroy()
            message.channel.send('The bot has left the voice channel.')

        } catch(e) {
            message.channel.send('The bot is not connected to any voice channel.')
        }

    }
}