const { getVoiceConnection } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'Makes the bot leave voice channel.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guild.id)) return interaction.editReply({ embeds: [embed.setDescription('You can\'t use this command while a music quiz is running. Type stop \`stopquiz\` instead')] });
        if (!client.queue.has(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('The bot is not connected to any voice channel.')] });

        let connection = getVoiceConnection(interaction.guild.id);

        connection.state.subscription.player.stop();
        connection.destroy();
        client.queue.delete(interaction.guildId);
        
        interaction.editReply({ embeds: [embed.setDescription('The bot has left the voice channel.')] });

    }
}