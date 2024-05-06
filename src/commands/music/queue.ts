import  {Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the queue.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} [\`${song.title}\`](${song.url}) - \`${song.live ? "live" : song.durationRaw}\``)
            .join('\n');

        interaction.editReply({ embeds: [embed.setTitle('Server Queue').setDescription(q)] });
    }
}