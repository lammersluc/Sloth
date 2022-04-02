module.exports = {
    name: 'leave',
    helpname: 'Leave',
    aliases: ['l' ,'stop', 's'],
    aliasesText: 'L, Stop, S',
    description: 'Makes the bot leave voice channel',
    usage: 'Leave',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        client.distube.voices.leave(message)
        message.channel.send('The bot has left the channel.')
    }
}