const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Shows the queue.',
    category: 'music',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${song.name}\` - \`${song.formattedDuration}\``)
            .join('\n');

        interaction.editReply({ embeds: [embed.setTitle('**Server Queue**').setDescription(q)] });
        
    }
}