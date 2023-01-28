const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'nowplaying',
    description: 'Shows info about the current song that is playing.',
    category: 'music',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        const song = queue.songs[0];
        
        let watchBar = '──────────────────────────────────────────────────'.split('');
        watchBar[Math.floor((queue.currentTime / song.duration) * 50)] = '⚪';
        watchBar = watchBar.join('');

        interaction.editReply({ embeds: [embed
            .setAuthor({ name: 'Now Playing' })
            .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
            .setURL(song.url)
            .setDescription(`\`${watchBar}\`\n\`${song.views.toLocaleString()} 👀 | ${song.likes.toLocaleString()} 👍 | ${queue.formattedCurrentTime} / ${song.formattedDuration} | 🔊 ${queue.volume}%\``)
            .setThumbnail(song.thumbnail)
            .setTimestamp()
            .setFooter({ text: `${song.user.username}#${song.user.discriminator}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })]
        });
        
    }
}