import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses/Resumes the current song.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const connection = getVoiceConnection(interaction.guildId);
        
        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed || !connection.state.subscription) return interaction.editReply({ embeds: [embed.setDescription('I am not playing anything right now.')] });
        
        const player = connection.state.subscription.player;

        if (player.state.status === AudioPlayerStatus.Paused) {
            player.unpause();
            return interaction.editReply({ embeds: [embed.setDescription('The song has been unpaused.')] });
        } else {
            player.pause();
            return interaction.editReply({ embeds: [embed.setDescription('The song has been paused.')] });
        }
    }
}