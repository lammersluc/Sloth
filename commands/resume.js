module.exports = {
    name: 'resume',
    aliases: [],
    aliasesText: '',
    description: 'Resumes the song playing.',
    usage: 'Resume',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing in the queue right now!`)
        queue.resume()
        message.channel.send('The song has been resumed.')
    }
}