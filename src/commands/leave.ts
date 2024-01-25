const { getVoiceConnection } = require('@discordjs/voice');
import { EmbedBuilder } from 'discord.js';

export default {
    name: 'leave',
    description: 'Makes the bot leave voice channel.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guild.id)) return interaction.editReply({ embeds: [embed.setDescription('You can\'t use this command while a music quiz is running. Type stop \`stopquiz\` instead')] });
        if (!client.queue.get(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        let connection = getVoiceConnection(interaction.guild.id);

        connection.state.subscription.player.stop();
        connection.destroy();
        client.queue.delete(interaction.guildId);
        
        interaction.editReply({ embeds: [embed.setDescription('The bot has left the voice channel.')] });

    }
}