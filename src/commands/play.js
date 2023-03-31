const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')
const play = require('play-dl')

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
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        const string = interaction.options.getString('search');
        const voiceChannel = interaction.member.voice.channel;
        let yt_info;
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

            player.addListener('stateChange', (oldState, newState) => {

                if (newState.status === AudioPlayerStatus.Idle && !player.resource && client.queue.get(interaction.guildId) !== undefined) {

                    if (client.queue.get(interaction.guildId).loop === true) {

                        let stream = play.stream(client.queue.get(interaction.guildId).songs[0].url);

                        let resource = createAudioResource(stream.stream, {
                            inputType: stream.type
                        });

                        player.play(resource);

                    }

                    if (!client.queue.get(interaction.guildId).songs[1]) { connection.state.subscription.player.stop(); connection.destroy(); return client.queue.delete(interaction.guildId); }

                    client.queue.get(interaction.guildId).songs.shift();

                    let stream = play.stream(client.queue.get(interaction.guildId).songs[0].url);

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
                    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })], components: []

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

                player.addListener('stateChange', (oldState, newState) => {
                    if (newState.status === AudioPlayerStatus.Idle && !player.resource) {
                        client.queue.get(interaction.guildId).songs.shift();
                        if (!client.queue.get(interaction.guildId).songs[0]) { client.distube.voices.leave(interaction); return interaction.editReply({ embeds: [embed.setDescription('The queue is empty. So the bot has left the voice channel.')] }); }
                        let stream = play.stream(client.queue.get(interaction.guildId).songs[0].url);
                        let resource = createAudioResource(stream.stream, {
                            inputType: stream.type
                        });
                        player.play(resource);
                    }
                });

            } else {

                const list = yt_info
                    .map((song, i) => `${i+1}. \`${song.title}\` - \`${song.durationRaw}\``)
                    .join('\n\n')

                let row = new ActionRowBuilder();
                let row2 = new ActionRowBuilder();

                yt_info.forEach(result => { row.addComponents(new ButtonBuilder().setLabel((yt_info.indexOf(result) + 1).toString()).setStyle('Primary').setCustomId(yt_info.indexOf(result).toString())); });
                row2.addComponents(new ButtonBuilder().setLabel('❌').setStyle('Primary').setCustomId('cancel'));

                interaction.editReply({ embeds: [embed.setTitle(`**Which song do you want to play?**`).setDescription(list)], components: [row, row2] }).then(msg => {
                    const filter = (button) => button.user.id === interaction.user.id;

                    collector = msg.createMessageComponentCollector({ filter, time: 30000 })
                    collector.on('collect', async (button) => {

                        collector.stop();

                        if (button.component.customId === 'cancel') {

                            if (client.queue.get(interaction.guildId) === undefined) connection.destroy();

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
                            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })], components: []

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
                
                    collector.on('end', c => { if (c.size === 0) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

                });

            }

        } catch (e) {

            console.log(e);

        }

    }
}