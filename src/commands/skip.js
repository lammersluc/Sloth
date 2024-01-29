const { EmbedBuilder } = require('discord.js');
const { getVoiceConnection, createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    name: 'skip',
    description: 'Skips to the next song.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);
        let connection = getVoiceConnection(interaction.guildId);
        let player = connection.state.subscription.player;

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        let stream;

        while (queue.songs.length > 0) {

            queue.songs.shift();

            if (!queue.songs[0]) { player.stop(); connection.destroy(); client.queue.delete(interaction.guildId); return interaction.editReply({ embeds: [embed.setDescription('There is nothing in the queue to skip to. So the bot has left the voice channel.')] }); }

            try {
                stream = await play.stream(queue.songs[0].url, { quality: 2 });
            } catch (e) {
                continue;
            }

            break;

        }
            
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });
        resource.volume.setVolume(client.volume);

        player.play(resource);

        interaction.editReply({ embeds: [embed.setDescription('Skipped.')] });

    }
}