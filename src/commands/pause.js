const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pauses/Resumes the current song.',
    category: 'music',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        const queue = client.distube.getQueue(interaction);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        
        if (queue.paused) { queue.resume(); return interaction.editReply({ embeds: [embed.setDescription('The song has been resumed.')] }); }
        else { queue.pause(); interaction.editReply({ embeds: [embed.setDescription('The song has been paused.')] }); }
        
    }
}