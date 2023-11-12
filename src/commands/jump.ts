const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const play = require('play-dl');

module.exports = {
    name: 'jump',
    description: 'Jumps to a song in the queue.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        const queue = client.queue.get(interaction.guildId)
        let embed = new EmbedBuilder().setColor(client.embedColor);
        let embed2 = new EmbedBuilder().setColor(client.embedColor);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        if (queue.songs.length <= 1) return interaction.editReply({ embeds: [embed.setDescription('There is nothing to jump to.')] });

        const q = queue.songs
            .map((song: any, i: number) => `${i == 0 ? 'Now Playing:' : `${i}.`} \`${song.title}\` - \`${song.durationRaw}\``)
            .join('\n')

        interaction.editReply({ embeds: [embed
            .setTitle('**Which song do you want to jump to?**')
            .setDescription(q)
        ]}).then(async () => {

            const filter = (m: any) => m.author.id == interaction.member.id;

            interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected: any) => {

                let position = parseInt(collected.first().content);

                if (isNaN(position) || position < 1 || position > queue.songs.length) return interaction.editReply({ embeds: [embed2.setDescription('Please provide a valid position.')] });

                client.queue.get(interaction.guildId).songs = queue.songs.slice(position);

                let connection = getVoiceConnection(interaction.guildId);

                let player = connection.state.subscription.player;

                let stream = await play.stream(queue.songs[0].url);
            
                let resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                });
        
                player.play(resource);

                interaction.editReply({ embeds: [embed2.setDescription(`Jumped to song position \`${position}\` in the queue.`)] });

            });
            
        }).catch(() => interaction.editReply({ embeds: [embed2.setDescription('You didn\'t choose anything after 30 seconds.') ]}) );

    }
}