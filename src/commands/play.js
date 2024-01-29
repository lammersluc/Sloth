const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice')
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

        if (!interaction.guild) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
        if (!interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect) || !interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to join or speak in this voice channel.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        try {

            const string = interaction.options.getString('search');

            let connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            let player = createAudioPlayer();

            player.addListener('stateChange', async (oldState, newState) => {

                let queue = client.queue.get(interaction.guildId);

                if (newState.status === AudioPlayerStatus.Idle && !player.resource && queue) {

                    let stream;

                    if (queue.loop) stream = await play.stream(client.queue.get(interaction.guildId).songs[0].url, { quality: 2 });
                    else {

                        while (true) {

                            queue.songs.shift();
        
                            if (queue.songs.length <= 0) { connection.state.subscription.player.stop(); connection.destroy(); return client.queue.delete(interaction.guildId); }
        
    
                            try {
    
                                stream = await play.stream(client.queue.get(interaction.guildId).songs[0].url, { quality: 2 });
    
                            } catch(e) {
                                continue;
                            }
    
                            break;

                        }

                    }

                    let resource = createAudioResource(stream.stream, {
                        inputType: stream.type
                    });

                    player.play(resource);

                }

            });

            const search = await play.search(string, { limit: 5 });

            if (search.length === 0) return interaction.editReply({ embeds: [embed.setDescription('No results found.')] }); 

            const list = search
                .map((song, i) => `${i+1}. \`${song.title}\` - \`${song.live ? "live" : song.durationRaw}\``)
                .join('\n\n')

            let row = new ActionRowBuilder();
            let row2 = new ActionRowBuilder();

            search.forEach(result => { row.addComponents(new ButtonBuilder().setLabel((search.indexOf(result) + 1).toString()).setStyle('Primary').setCustomId(search.indexOf(result).toString())); });
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

                    const song = search[parseInt(button.customId)];

                    song.user = interaction.user;
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
                    
                    let stream;
                    
                    try {

                        stream = await play.stream(song.url, { quality: 2 });

                    } catch(e) {
                        client.queue.delete(interaction.guildId);
                        connection.destroy();
                        return interaction.editReply({ embeds: [embed.setAuthor({ name: 'Couldn\'t add song' }).setDescription('This video is age restricted.')] });
                    }
                
                    let resource = createAudioResource(stream.stream, {
                        inputType: stream.type
                    });

                    player.play(resource);
                
                    connection.subscribe(player);

                })
            
                collector.on('end', c => { if (c.size === 0) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

            });

        } catch (e) {

            console.log(e);

        }

    }
}