const { EmbedBuilder } = require('discord.js');
const { sleep } = require('../addons.js');

module.exports = {
    name: 'jump',
    helpname: 'Jump',
    aliases: ['goto'],
    aliasesText: 'Goto',
    description: 'Jumps to a song in the queue.',
    usage: 'Jump',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor);
        let embed2 = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (queue.songs.length <= 1) return message.channel.send({ embeds: [embed.setDescription('There is nothing to jump to.')] });
        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${song.name}\` - \`${song.formattedDuration}\``)
            .join('\n')

        message.channel.send({ embeds: [embed
            .setTitle('**Which song do you want to jump to?**')
            .setDescription(q)
        ]});

        await sleep(500);
        await message.channel.awaitMessages({ max: 1, time: 30000, errors: ['time'] }).then(collected => {
            let position = parseInt(collected.first().content);
            if (isNaN(position)) return message.channel.send({ embeds: [embed2.setDescription('Please specify a valid song position.')] });
            if (position > queue.songs.length) return message.channel.send({ embeds: [embed2.setDescription('The position you provided is longer than the queue.')] });
            if (position < 1) return message.channel.send({ embeds: [embed2.setDescription('Please provide a position of at least 1.')] });
            queue.jump(position);
            message.channel.send({ embeds: [embed2.setDescription(`Jumped to song position \`${position}\` in the queue.`)] });
        }).catch(collected => {
            message.channel.send({ embeds: [embed2.setDescription('You didn\'t choose anything after 30 seconds.')] })
        });
    }
}