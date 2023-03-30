const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'nowplaying',
    description: 'Shows info about the current song that is playing.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        const song = queue.songs[0];
        
        let watchBar = '──────────────────────────────────────────────────'.split('');
        watchBar[Math.floor(moment(Date.now() - song.user.time).format('s') / song.durationInSec * 50)] = '⚪';
        watchBar = watchBar.join('');

        interaction.editReply({ embeds: [embed
            .setAuthor({ name: 'Now Playing' })
            .setTitle(`\`${song.title}\` - \`${song.channel.name}\``)
            .setURL(song.url)
            .setDescription(`\`${watchBar}\`\n\`${song.views.toLocaleString()} 👀 | ${song.likes.toLocaleString()} 👍 | ${moment(Date.now() - song.user.time).format('m:ss')} / ${song.durationRaw}\``)
            .setThumbnail(song.thumbnails[0].url)
            .setTimestamp(song.user.time)
            .setFooter({ text: `${song.user.username}#${song.user.discriminator}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })]
        });
        
    }
}