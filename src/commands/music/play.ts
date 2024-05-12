import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, GuildMember, ButtonStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays music in your voice channel.')
        .addStringOption(o => o
            .setName('query')
            .setDescription('Enter the query to search for.')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);
        const member = interaction.member as GuildMember;
        const channel = member.voice.channel;

        if (!channel) return interaction.editReply({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
        if (!channel.viewable) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to view this voice channel.')] });
        if (!channel.joinable) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to join this voice channel.')] });
        if (channel.full) return interaction.editReply({ embeds: [embed.setDescription('The voice channel is full.')] });
        if (client.musicquiz.includes(channel.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const query = interaction.options.getString('query', true);
    
        const player = useMainPlayer();
        const queue = useQueue(channel.guildId);

        if (queue && queue.channel?.id !== channel.id) return interaction.editReply({ embeds: [embed.setDescription('I\'m already playing music in a different channel.')] });
    
        const result = await player
            .search(query, { searchEngine: 'youtube', requestedBy: interaction.user })
            .catch(() => null);

        if (!result?.hasTracks) return interaction.editReply({ embeds: [embed.setDescription('No results found.')] });

        const tracks = result.tracks.slice(0, 5);

        const list = tracks.map((track, i) => `${i + 1}. \`${track.title}\` - \`${track.duration}\``).join('\n\n');
        
        const row = new ActionRowBuilder<ButtonBuilder>();
        const row2 = new ActionRowBuilder<ButtonBuilder>();

        tracks.forEach((_, i) => row.addComponents(
            new ButtonBuilder({
                label: (i + 1).toString(),
                style: ButtonStyle.Primary,
                customId: i.toString(),
            })
        ));
        row2.addComponents(
            new ButtonBuilder({
                label: '❌',
                style: ButtonStyle.Danger,
                customId: 'cancel',
            })
        );

        const msg = await interaction.editReply({ embeds: [embed.setTitle('Which song do you want to play?').setDescription(list)], components: [row, row2] });

        const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
        const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, max: 1, time: 30000 });

        collector.on('collect', async (button) => {
            collector.stop();

            if (button.customId === 'cancel') return interaction.editReply({ embeds: [embed.setDescription('Cancelled.')], components: [] });

            const track = result.tracks[parseInt(button.customId)];

            if (queue) queue.addTrack(track);
            else player.play(channel, track, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });

            interaction.editReply({
                embeds: [embed
                    .setAuthor({ name: 'Added song' })
                    .setTitle(`\`${track.title}\` - \`${track.author}\``)
                    .setDescription(null)
                    .setURL(track.url)
                    .setThumbnail(track.thumbnail)
                    .setTimestamp()
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                ],
                components: []
            });
        });

        collector.on('end', (collected) => collected.size === 0 && interaction.editReply({ embeds: [embed.setTitle(null).setDescription('You did not choose a song in time.')], components: [] }));
    }
}