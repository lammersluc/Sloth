module.exports = {
    name: 'queue',
    aliases: ['q'],
    aliasesText: 'Q',
    description: 'Shows the queue.',
    usage: 'Queue',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing playing!`)
        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
            .join('\n')
        message.channel.send(`**Server Queue**\n${q}` + message)
    }
}