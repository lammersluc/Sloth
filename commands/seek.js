module.exports = {
    name: 'seek',
    helpname: 'Seek',
    aliases: [],
    aliasesText: '',
    description: 'Seek a position in the current song.',
    usage: 'Seek (time)',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing playing right now.`)
        if (!args[0]) {
            return message.channel.send('Please provide position (in seconds) to seek.')
          }
        const time = Number(args[0])
        if (isNaN(time)) return message.channel.send('Please enter a valid number.')
        if (time < 0) return message.channel.send('Please enter a positive number.')
        queue.seek(time)
        message.channel.send(`Seeked to ${time} Seconds.`)
    }
}