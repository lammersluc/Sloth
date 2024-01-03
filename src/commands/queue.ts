import { EmbedBuilder } from 'discord.js';

module.exports = {
    name: 'queue',
    description: 'Shows the queue.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client:any , interaction: any) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const q = queue.songs
            .map((song: any, i: number) => `${i == 0 ? 'Now Playing:' : `${i}.`} [\`${song.title}\`](${song.url}) - \`${song.durationRaw == "0:00" ? "live" : song.durationRaw}\``)
            .join('\n');

        interaction.editReply({ embeds: [embed.setTitle('**Server Queue**').setDescription(q)] });
        
    }
}