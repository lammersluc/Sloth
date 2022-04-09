module.exports = {
    name: 'nowplaying',
    helpname: 'Now Playing',
    aliases: ['np'],
    aliasesText: 'NP',
    description: 'Shows info about the current song that is playing.',
    usage: 'NowPlaying',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing playing.`)
        const song = queue.songs[0]
        message.channel.send(
            `Now playing: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
              song.user}\n${song.url}`
          )
    }
}