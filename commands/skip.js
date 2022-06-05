module.exports = {
    name: 'skip',
    helpname: 'Skip',
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
      if (!queue) return message.channel.send(`There is nothing playing right now`)
      if (!queue.songs[1]) return message.channel.send(`There is nothing in the queue to skip to.`)
      try {
        const song = await queue.skip()
        message.channel.send(`Skipped.`)
      } catch (e) {
        message.channel.send('There was an error trying to skip.')
      }
  }
}