const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'queue',
    helpname: 'Queue',
    aliases: ['q'],
    aliasesText: 'Q',
    description: 'Shows the queue.',
    usage: 'Queue',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing right now.')] })
        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${song.name}\` - \`${song.formattedDuration}\``)
            .join('\n')

        message.channel.send({ embeds: [embed
            .setTitle('**Server Queue**')
            .setDescription(q)
        ]})
    }
}