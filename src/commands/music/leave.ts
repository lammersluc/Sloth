import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, type VoiceConnectionReadyState } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Makes the bot leave voice channel.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('You can\'t use this command while a music quiz is running. Type stop \`stopquiz\` instead')] });
        if (!client.queue.get(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const connection = getVoiceConnection(interaction.guildId ?? '');

        if (connection) {
            (connection.state as VoiceConnectionReadyState).subscription?.player.stop();
            connection.destroy();
        }

        client.queue.delete(interaction.guildId);
        interaction.editReply({ embeds: [embed.setDescription('The bot has left the voice channel.')] });
    }
}