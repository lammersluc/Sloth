import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { QueueRepeatMode, useQueue } from "discord-player";

export default {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Sets repeat mode')
        .addIntegerOption(o => o
            .setName('repeat')
            .setDescription('Choose the repeat mode')
            .setRequired(true)
            .addChoices([
                { name: 'Off', value: QueueRepeatMode.OFF },
                { name: 'Track', value: QueueRepeatMode.TRACK },
                { name: 'Queue', value: QueueRepeatMode.QUEUE }
            ])
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const repeatMode = interaction.options.getInteger('looping', true);

        queue.setRepeatMode(repeatMode);
        interaction.editReply({ embeds: [embed.setDescription(`Set the repeat mode to \`${QueueRepeatMode[repeatMode].toLowerCase().capitalize()}\`.`)] });
    }
}
