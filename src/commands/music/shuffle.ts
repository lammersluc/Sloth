import { useQueue } from 'discord-player';
import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Sets shuffle mode.')
        .addBooleanOption(o => o
            .setName('shuffle')
            .setDescription('Enable shuffle mode.')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        if (!interaction.guildId) return interaction.editReply({ embeds: [embed.setDescription('This command can only be used in a server.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = useQueue(interaction.guildId);

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });

        const shuffle = interaction.options.getBoolean('shuffle', true);

        if (shuffle) queue.enableShuffle();
        else queue.disableShuffle();

        interaction.editReply({ embeds: [embed.setDescription(`Set shuffle mode to \`${shuffle ? 'enabled': 'disabled'}\`.`)] });
    }
}
