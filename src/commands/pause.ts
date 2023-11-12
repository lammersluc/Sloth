const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pauses/Resumes the current song.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        
        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        let connection = getVoiceConnection(interaction.guildId);
        let player = connection.state.subscription.player;
        
        if (player.state.status == AudioPlayerStatus.Paused) { player.unpause(); return interaction.editReply({ embeds: [embed.setDescription('The song has been unpaused.')] }); }
        else { player.pause(); return interaction.editReply({ embeds: [embed.setDescription('The song has been paused.')] }); }
        
    }
}