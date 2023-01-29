const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Seek to a specific time in the current song.',
    category: 'music',
    options: [
        {
            name: 'time',
            type: 'integer',
            minValue: 1,
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction);
        const time = interaction.options.getInteger('time');
        
        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        if (time > queue.songs[0].duration) return interaction.editReply({ embeds: [embed.setDescription('The time specified is longer than the song\'s duration.')] });

        queue.seek(time);

        interaction.editReply({ embeds: [embed.setDescription(`Seeked to ${time} seconds.`)] });

    }
}