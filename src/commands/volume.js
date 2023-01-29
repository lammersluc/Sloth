const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'Set the volume of the music bot.',
    category: 'music',
    options: [{ name: 'volume', forced: true }],
    enabled: true,
    devOnly: false,
    adminOnly: true,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction);
        const volume = parseInt(interaction.options.getString('volume'));

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription(`There is nothing playing right now.`)] });
        if (volume < 0 || volume > 1000) return interaction.editReply({ embeds: [embed.setDescription(`Please provide a volume between 0 and 1000.`)] });
        
        client.distube.setVolume(interaction, volume);
        
        interaction.editReply({ embeds: [embed.setDescription(`The volume has been set to ${queue.volume}%.`)] });
        
    }
}