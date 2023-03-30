const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pauses/Resumes the current song.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        let connection = getVoiceConnection(interaction.guildId);
        let player = connection.state.subscription.player;
        
        if (queue.playing) { client.queue.get(interaction.guildId).playing = false; player.pause(); return interaction.editReply({ embeds: [embed.setDescription('The song has been paused.')] }); }
        if (!queue.playing) { client.queue.get(interaction.guildId).playing = true; player.unpause(); return interaction.editReply({ embeds: [embed.setDescription('The song has been resumed.')] }); }
        
    }
}