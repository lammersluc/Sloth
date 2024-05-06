import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection, createAudioResource, VoiceConnectionStatus } from '@discordjs/voice';
import play from 'play-dl';
import moment from 'moment';

export default {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current song.')
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('Enter the time to seek to in seconds')
                .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const song = queue.songs[0];
        let time = interaction.options.getInteger('time')!;

        if (time < 0) time = 0;
        else if (time > (song.durationInSec - 5)) time = song.durationInSec - 5;

        const stream = await play.stream(song.url, { seek: time, quality: 2 });

        const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });

        const connection = getVoiceConnection(interaction.guildId);

        if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
            connection.state.subscription?.player.play(resource);
            song.startedTime = time;
            return interaction.editReply({ embeds: [embed.setDescription(`Seeked to \`${moment(time * 1000).format('m:ss')}\`.`)] });
        }

        interaction.editReply({ embeds: [embed.setDescription('I am not connected to any voice channel.')] });
    }
}