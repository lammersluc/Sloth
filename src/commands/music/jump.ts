import { Client, ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { VoiceConnectionStatus, createAudioResource, getVoiceConnection } from '@discordjs/voice';
import play, { Queue } from 'play-dl';

export default {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jumps to a song in the queue.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        if (queue.songs.length <= 1) return interaction.editReply({ embeds: [embed.setDescription('There is nothing to jump to.')] });

        const q = (queue as Queue).songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${song.title}\` - \`${song.durationRaw}\``)
            .join('\n');

        await interaction.editReply({ embeds: [embed.setTitle('**Which song do you want to jump to?**').setDescription(q)] }).catch();

        const filter = (m: Message) => m.author.id === interaction.user.id;
        const msg = (await interaction.channel?.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).catch(() => null))?.first();

        if (!msg) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')] });

        let position = parseInt(msg!.content ?? '');

        if (isNaN(position) || position < 1 || position > queue.songs.length) return interaction.editReply({ embeds: [embed.setDescription('Please provide a valid position.')] });

        queue.songs = queue.songs.slice(position);

        const connection = getVoiceConnection(interaction.guildId!);

        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) return interaction.editReply({ embeds: [embed.setDescription('I am not playing anything right now.')] });
        
        const player = connection.state.subscription?.player;
        const stream = await play.stream(queue.songs[0].url, { quality: 2 });
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type
        });

        player?.play(resource);

        interaction.editReply({ embeds: [embed.setDescription(`Jumped to song position \`${position}\` in the queue.`)] });
    }
}