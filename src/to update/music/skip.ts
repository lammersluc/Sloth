import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection, createAudioResource, VoiceConnectionStatus } from '@discordjs/voice';
import play from 'play-dl';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to the next song.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = client.queue.get(interaction.guildId);
        const connection = getVoiceConnection(interaction.guildId);

        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed || !connection.state.subscription) return interaction.editReply({ embeds: [embed.setDescription('I am not connected to any voice channel.')] });
        
        const player = connection.state.subscription.player;

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        let stream;

        while (queue.songs.length > 0) {
            queue.songs.shift();

            if (!queue.songs[0]) {
                player.stop();
                connection.destroy();
                client.queue.delete(interaction.guildId);
                return interaction.editReply({ embeds: [embed.setDescription('There is nothing in the queue to skip to. The bot has left the voice channel.')] });
            }

            stream = await play.stream(queue.songs[0].url, { quality: 2 }).catch(() => null);

            if (!stream) continue;
            break;
        }

        if (!stream) {
            player.stop();
            connection.destroy();
            client.queue.delete(interaction.guildId);
            return interaction.editReply({ embeds: [embed.setDescription('There was an error while trying to play the next song. The bot has left the voice channel.')] });
        }

        const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });

        player.play(resource);

        interaction.editReply({ embeds: [embed.setDescription('Skipped.')] });
    }
}