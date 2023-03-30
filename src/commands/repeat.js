const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'repeat',
    description: 'Enables/Disables repeat mode.',
    category: 'music',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = client.queue.get(interaction.guildId);
        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing in the queue.')] });

        client.queue.get(interaction.guildId).repeat = !queue.repeat;

        interaction.editReply({ embeds: [embed.setDescription(`Switched the repeat mode to \`${!queue.repeat}\`.`)] });

    }
}