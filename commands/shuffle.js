module.exports = {
    name: 'shuffle',
    helpname: 'Shuffle',
    aliases: [],
    aliasesText: '',
    description: 'Shuffles the queue.',
    usage: 'Shuffle',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing in the queue right now.`)
        queue.shuffle()
        message.channel.send('Shuffled songs in the queue.')
    }
}