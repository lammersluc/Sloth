import { EmbedBuilder } from 'discord.js';
const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
import play from 'play-dl';

export default {
    name: 'skip',
    description: 'Skips to the next song.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);
        let connection = getVoiceConnection(interaction.guildId);
        let player = connection.state.subscription.player;

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        if (!queue.songs[1]) { player.stop(); connection.destroy(); client.queue.delete(interaction.guildId); return interaction.editReply({ embeds: [embed.setDescription('There is nothing in the queue to skip to. So the bot has left the voice channel.')] }); }

        client.queue.get(interaction.guildId).songs.shift();

        let stream = await play.stream(queue.songs[0].url);
            
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });

        player.play(resource);

        interaction.editReply({ embeds: [embed.setDescription('Skipped.')] });

    }
}