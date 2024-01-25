import { EmbedBuilder } from 'discord.js';

export default {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        let song = queue.songs[0]
        queue.songs.shift();
        queue.songs = queue.songs.sort(() => Math.random() - 0.5);
        queue.songs.unshift(song);

        client.queue.get(interaction.guildId).songs = queue.songs;

        interaction.editReply({ embeds: [embed.setDescription('Shuffled the songs in queue.')] });
        
    }
}