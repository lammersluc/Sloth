const { MessageEmbed } = require('discord.js')

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
        let embed = new MessageEmbed().setColor('#00a8f3')
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send({ embeds: [embed.setDescription`There is nothing playing.`] })
        const song = queue.songs[0]
        let songWatched = Math.floor((queue.currentTime / song.duration) * 50)
        const watchBar = '───────────────────────────────────────────────────'
        let watchBar2 = watchBar.split('')
        watchBar2[songWatched] = '⚪'
        let changedwatchBar = watchBar2.join('')

        message.channel.send({ embeds: [embed
            .setAuthor({ name: 'Now Playing' })
            .setTitle(`\`${song.name}\` - \`${song.formattedDuration}\``)
            .setURL(song.url)
            .setDescription(`\`${changedwatchBar}\`\n\`${song.views} views | ${song.likes} likes | ${queue.formattedCurrentTime} / ${song.formattedDuration} | 🔊 ${queue.volume}%\``)
            .setThumbnail(song.thumbnail)
            .setTimestamp()
            .setFooter({ text: `${song.user.username}#${song.user.discriminator}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })
            .setColor(client.embedColor)
        ]})
    }
}