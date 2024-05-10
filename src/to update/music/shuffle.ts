import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = client.queue.get(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const song = queue.songs[0];
        queue.songs.shift();
        queue.songs = queue.songs.shuffle();
        queue.songs.unshift(song);

        interaction.editReply({ embeds: [embed.setDescription('Shuffled the songs in the queue.')] });
    }
}
