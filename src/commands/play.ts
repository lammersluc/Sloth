import { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
import play from 'play-dl';

module.exports = {
    name: 'play',
    description: 'Plays music in your voice channel.',
    category: 'music',
    options: [
        {
            name: 'search',
            type: 'string',
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        const string = interaction.options.getString('search');
        const voiceChannel = interaction.member.voice.channel;
        let yt_info: any[];
        let song;

        if (!voiceChannel) return interaction.editReply({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
        if (!interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect) || !interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to join or speak in this voice channel.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        try {

            let connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            let player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            player.addListener('stateChange', async (oldState: any, newState: any) => {

                let queue = client.queue.get(interaction.guildId);

                if (newState.status == AudioPlayerStatus.Idle && !player.resource && queue) {

                    if (!queue.loop) {

                        queue.songs.shift();

                        if (queue.songs.length == 0) { connection.state.subscription.player.stop(); connection.destroy(); return client.queue.delete(interaction.guildId); }

                    }
                    
                    let stream = await play.stream(client.queue.get(interaction.guildId).songs[0].url);

                    let resource = createAudioResource(stream.stream, {
                        inputType: stream.type
                    });

                    player.play(resource);

                }
            });

            yt_info = await play.search(string, {
                limit: 5
            })

            if (string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {

                yt_info[0].user = interaction.user;
                song = yt_info[0];
                song.startedTime = 0;

                interaction.editReply({ embeds: [embed

                    .setAuthor({ name: 'Added Song' })
                    .setTitle(`\`${song.title}\` - \`${song.channel.name}\``)
                    .setURL(song.url)
                    .setDescription(null)
                    .setThumbnail(song.thumbnails.slice[0].url)
                    .setTimestamp(song.user.time)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })], components: []

                });

                if (client.queue.has(interaction.guildId)) return client.queue.get(interaction.guildId).songs.push(song);

                    client.queue.set(interaction.guildId, {
                        songs: [],
                        loop: false,
                    });
            
                client.queue.get(interaction.guildId).songs.push(song);
            
                let stream = await play.stream(song.url);
            
                let resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                });
            
                player.play(resource);
            
                connection.subscribe(player);

            } else {

                const list = yt_info
                    .map((song, i) => `${i+1}. \`${song.title}\` - \`${song.durationRaw == "0:00" ? "live" : song.durationRaw}\``)
                    .join('\n\n')

                let row = new ActionRowBuilder();
                let row2 = new ActionRowBuilder();

                yt_info.forEach(result => { row.addComponents(new ButtonBuilder().setLabel((yt_info.indexOf(result) + 1).toString()).setStyle(1).setCustomId(yt_info.indexOf(result).toString())); });
                row2.addComponents(new ButtonBuilder().setLabel('❌').setStyle(1).setCustomId('cancel'));

                interaction.editReply({ embeds: [embed.setTitle(`**Which song do you want to play?**`).setDescription(list)], components: [row, row2] }).then((msg: any) => {
                    const filter = (button: any) => button.user.id == interaction.user.id;

                    const collector: any = msg.createMessageComponentCollector({ filter, time: 30000 })
                    collector.on('collect', async (button: any) => {

                        collector.stop();

                        if (button.component.customId == 'cancel') {

                            if (client.queue.get(interaction.guildId) == undefined) connection.destroy();

                            return interaction.editReply({embeds: [embed.setDescription('Cancelled.')], components: [] });

                        }

                        yt_info[parseInt(button.customId)].user = interaction.user;
                        song = yt_info[parseInt(button.customId)];
                        song.startedTime = 0;

                        interaction.editReply({ embeds: [embed

                            .setAuthor({ name: 'Added Song' })
                            .setTitle(`\`${song.title}\` - \`${song.channel.name}\``)
                            .setURL(song.url)
                            .setDescription(null)
                            .setThumbnail(song.thumbnails[0].url)
                            .setTimestamp(song.user.time)
                            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })], components: []

                        });
                
                        if (client.queue.has(interaction.guildId)) return client.queue.get(interaction.guildId).songs.push(song);

                        client.queue.set(interaction.guildId, {
                            songs: [],
                            loop: false,
                        });
                
                        client.queue.get(interaction.guildId).songs.push(song);
                    
                        let stream = await play.stream(song.url);
                    
                        let resource = createAudioResource(stream.stream, {
                            inputType: stream.type
                        });
                    
                        player.play(resource);
                    
                        connection.subscribe(player);

                    })
                
                    collector.on('end', (c: any) => { if (c.size == 0) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

                });

            }

        } catch (e) {

            console.log(e);

        }

    }
}