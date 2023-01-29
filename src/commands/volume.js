const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'Set the volume of the music bot.',
    category: 'music',
    options: [
        {
            name: 'volume',
            type: 'integer',
            minValue: 1,
            maxValue: 1000,
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: true,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction);
        const volume = interaction.options.getInteger('volume');

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription(`There is nothing playing right now.`)] });
        
        client.distube.setVolume(interaction, volume);
        
        interaction.editReply({ embeds: [embed.setDescription(`The volume has been set to ${queue.volume}%.`)] });
        
    }
}