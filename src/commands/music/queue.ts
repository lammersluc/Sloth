import { useQueue } from 'discord-player';
import  { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the queue.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = useQueue(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const q = queue.tracks.map((track, i) => `${i + 1}. [\`${track.title}\` - \`${track.author}\`](${track.url})`)
        q.unshift(`Now playing: [\`${queue.currentTrack?.title}\` - \`${queue.currentTrack?.author}\`](${queue.currentTrack?.url})`)
        
        interaction.editReply({ embeds: [embed.setTitle('Server Queue').setDescription(q.join('\n'))] });
    }
}