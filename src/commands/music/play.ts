import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, GuildMember, PermissionsBitField, ButtonStyle, ButtonInteraction, ComponentType } from 'discord.js';
import { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';
import play from 'play-dl';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays music in your voice channel.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Enter the query to search for.')
                .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guild) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (!(interaction.member as GuildMember).voice.channelId) return interaction.editReply({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
        if (!(interaction.member as GuildMember).voice.channel!.permissionsFor(interaction.guild.members.me as GuildMember).has([PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak])) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to join or speak in this voice channel.')] });
        if (client.musicquiz.includes(interaction.guild.id)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const string = interaction.options.getString('search')!;

        const connection = joinVoiceChannel({
            channelId: (interaction.member as GuildMember).voice.channelId!,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true
        });

        const player = createAudioPlayer();

        player.on('stateChange', async (_oldState, newState) => {
            const queue = client.queue.get(interaction.guildId!);
            
            if (newState.status !== AudioPlayerStatus.Idle || !queue) return;

            let stream;

            if (queue.loop) stream = await play.stream(queue.songs[0].url, { quality: 2 });
            else {
                while (true) {
                    queue.songs.shift();

                    if (queue.songs.length <= 0) {
                        if (connection.state.status !== VoiceConnectionStatus.Destroyed)
                            connection.state.subscription?.player.stop();
                        connection.destroy();
                        client.queue.delete(interaction.guildId!);
                    }

                    try {
                        stream = await play.stream(queue.songs[0].url, { quality: 2 });
                    } catch {
                        continue;
                    }

                    break;
                }
            }

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            player.play(resource);
        });

        const search = await play.search(string, { limit: 5 });

        if (search.length === 0) return interaction.editReply({ embeds: [embed.setDescription('No results found.')] });

        const list = search.map((song, i) => `${i + 1}. \`${song.title}\` - \`${song.live ? "live" : song.durationRaw}\``).join('\n\n');

        const row = new ActionRowBuilder<ButtonBuilder>();
        const row2 = new ActionRowBuilder<ButtonBuilder>();

        search.forEach(result => {
            row.addComponents(new ButtonBuilder().setLabel((search.indexOf(result) + 1).toString()).setStyle(ButtonStyle.Primary).setCustomId(search.indexOf(result).toString()));
        });
        row2.addComponents(new ButtonBuilder().setLabel('❌').setStyle(ButtonStyle.Danger).setCustomId('cancel'));

        const msg = await interaction.editReply({ embeds: [embed.setTitle('Which song do you want to play?').setDescription(list)], components: [row, row2] })
        
        const filter = (b: ButtonInteraction) => b.user.id === interaction.user.id;
        const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 30000 });

        collector.on('collect', async (button) => {
            collector.stop();

            const queue = client.queue.get(interaction.guildId!);

            if (button.customId === 'cancel') {
                if (!queue) connection.destroy();
                return interaction.editReply({ embeds: [embed.setDescription('Cancelled.')], components: [] });
            }

            const song = search[parseInt(button.customId)];
            song.member = interaction.member as GuildMember;
            song.startedTime = 0;

            interaction.editReply({
                embeds: [embed
                    .setAuthor({ name: 'Added Song' })
                    .setTitle(`\`${song.title}\` - \`${song.channel?.name}\``)
                    .setURL(song.url)
                    .setDescription(null)
                    .setThumbnail(song.thumbnails[0].url)
                    .setTimestamp()
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                ],
                components: []
            });

            if (queue) queue.songs.push(song);
            else {
                client.queue.set(interaction.guildId!, {
                    songs: [],
                    loop: false,
                });
                client.queue.get(interaction.guildId!)?.songs.push(song);
            }

            let stream;
            try {
                stream = await play.stream(song.url, { quality: 2 });
            } catch (e) {
                client.queue.delete(interaction.guildId!);
                connection.destroy();
                return interaction.editReply({ embeds: [embed.setAuthor({ name: 'Couldn\'t add song' }).setDescription('This video is age restricted.')] });
            }

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            player.play(resource);
            connection.subscribe(player);
        });

        collector.on('end', c => {
            if (c.size === 0) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] });
        });
    }
}