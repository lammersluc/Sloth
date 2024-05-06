import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, type AudioPlayerPlayingState, type VoiceConnectionReadyState } from '@discordjs/voice';
import moment from 'moment';

export default {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Shows info about the current song that is playing.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const song = queue.songs[0];

        let time = song.startedTime * 1000 + ((getVoiceConnection(interaction.guildId)?.state as VoiceConnectionReadyState).subscription?.player.state as AudioPlayerPlayingState).resource.playbackDuration;

        let watchBar;
        if (song.live) {
            watchBar = '──────────────────────────────────────────────────⚪';
        } else {
            watchBar = '──────────────────────────────────────────────────'.split('');
            watchBar[Math.floor(time / song.durationInSec / 20)] = '⚪';
            watchBar = watchBar.join('');
        }

        interaction.editReply({
            embeds: [embed
                .setAuthor({ name: 'Now Playing' })
                .setTitle(`\`${song.title}\` - \`${song.channel?.name}\``)
                .setURL(song.url)
                .setDescription(`\`${watchBar}\`\n\`${song.views.toLocaleString()} 👀 | ${moment(time).format('m:ss')} / ${song.live ? "live" : song.durationRaw} | ${song.uploadedAt}\``)
                .setThumbnail(song.thumbnails[0].url)
                .setTimestamp(Date.now() - time)
                .setFooter({ text: song.member.displayName, iconURL: song.member.displayAvatarURL() })
            ]
        });
    }
}