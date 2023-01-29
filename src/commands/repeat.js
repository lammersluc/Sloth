const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'repeat',
    description: 'Switches the repeat mode',
    category: 'music',
    options: [
        {
            name: 'mode',
            type: 'string',
            choices: [
                { name: 'Off', value: 'off' },
                { name: 'Song', value: 'song' },
                { name: 'Queue', value: 'queue' }
            ],
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);

        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing in the queue.')] });

        let mode = interaction.options.getString('mode');
        
        if (mode === 'off') mode = 0;
        else if (mode === 'song') mode = 1;
        else if (mode === 'queue') mode = 2;

        queue.setRepeatMode(mode);

        interaction.editReply({ embeds: [embed.setDescription(`Set repeat mode to \`${mode}\`.`)] });

    }
}