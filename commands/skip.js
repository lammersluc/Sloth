module.exports = {
    name: 'skip',
    aliases: ['next'],
    aliasesText: 'Next',
    description: 'Skips to the next song.',
    usage: 'Skip',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) {
        }
        try {
          const song = await queue.skip()
          message.channel.send(`Skipped!`)
        } catch (e) {
          message.channel.send(`There is nothing in the queue right now!`)
        }
    }
}