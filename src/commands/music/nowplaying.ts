import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Shows info about the current song that is playing'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = useQueue(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const track = queue.currentTrack;

        if (!track) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        interaction.editReply({
            embeds: [embed
                .setAuthor({ name: 'Now Playing' })
                .setTitle(`\`${track.title}\` - \`${track.author}\``)
                .setURL(track.url)
                .setDescription(`\`${queue.node.createProgressBar()}\``)
                .setThumbnail(track.thumbnail)
                .setTimestamp((track.metadata as ChatInputCommandInteraction).createdTimestamp)
                .setFooter({ text: track.requestedBy?.displayName ?? '', iconURL: track.requestedBy?.displayAvatarURL() })
            ]
        });
    }
}