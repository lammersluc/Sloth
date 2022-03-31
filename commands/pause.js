module.exports = {
    name: 'pause',
    aliases: [],
    aliasesText: 'P',
    description: 'Pauses the song playing.',
    usage: 'Pause',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing in the queue right now!`)
        if (queue.pause) {
          return message.channel.send('Already paused.')
        }
        queue.pause()
        message.channel.send('The song has been paused.')
    }
}