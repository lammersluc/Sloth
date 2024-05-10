import { useQueue } from "discord-player";
import { Client, ChatInputCommandInteraction, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jumps to a song in the queue.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guild) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });

        const queue = useQueue(interaction.guild.id);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guild.id)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        if (queue.tracks.size <= 1) return interaction.editReply({ embeds: [embed.setDescription('There is nothing to jump to.')] });

        const q = queue.tracks
            .map((track, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${track.title}\` - \`${track.duration}\``)
            .join('\n');

        await interaction.editReply({ embeds: [embed.setTitle('**Which song do you want to jump to?**').setDescription(q)] }).catch();

        const filter = (m: Message) => m.author.id === interaction.user.id;
        const msg = (await interaction.channel?.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).catch(() => null))?.first();

        if (!msg) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')] });

        let position = parseInt(msg!.content ?? '');

        if (isNaN(position) || position < 1 || position > queue.tracks.size) return interaction.editReply({ embeds: [embed.setDescription('Please provide a valid position.')] });

        queue.node.jump(position);

        interaction.editReply({ embeds: [embed.setDescription(`Jumped to song position \`${position}\` in the queue.`)] });
    }
}