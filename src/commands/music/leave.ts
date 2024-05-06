import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { VoiceConnectionStatus, getVoiceConnection } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Makes the bot leave voice channel.'),
    async execute(client: any, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guild?.id)) return interaction.editReply({ embeds: [embed.setDescription('You can\'t use this command while a music quiz is running. Type stop \`stopquiz\` instead')] });
        if (!client.queue.get(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const connection = getVoiceConnection(interaction.guildId as string);

        if (connection?.state.status !== VoiceConnectionStatus.Ready) return interaction.editReply({ embeds: [embed.setDescription('I am not playing anything right now.')] });
        connection.state.subscription?.player.stop();
        connection.destroy();
        client.queue.delete(interaction.guildId);

        interaction.editReply({ embeds: [embed.setDescription('The bot has left the voice channel.')] });
    }
}
