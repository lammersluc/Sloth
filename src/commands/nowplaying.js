const { getVoiceConnection } = require('@discordjs/voice');
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

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        const song = queue.songs[0];

        let time = song.startedTime * 1000 + getVoiceConnection(interaction.guildId).state.subscription.player._state.resource.playbackDuration;
        
        let watchBar;
        if (song.durationInSec === 0) {

            watchBar = '──────────────────────────────────────────────────⚪'

        } else {

            watchBar = '──────────────────────────────────────────────────'.split('');
            watchBar[Math.floor(time / song.durationInSec / 20)] = '⚪';
            watchBar = watchBar.join('');

        }

        interaction.editReply({ embeds: [embed
            .setAuthor({ name: 'Now Playing' })
            .setTitle(`\`${song.title}\` - \`${song.channel.name}\``)
            .setURL(song.url)
            .setDescription(`\`${watchBar}\`\n\`${song.views.toLocaleString()} 👀 | ${moment(time).format('m:ss')} / ${song.durationRaw === "0:00" ? "live" : song.durationRaw}\``)
            .setThumbnail(song.thumbnails[0].url)
            .setTimestamp(Date.now() - time)
            .setFooter({ text: song.user.username, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })]
        });
        
    }
}