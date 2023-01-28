const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'jump',
    description: 'Jumps to a song in the queue.',
    category: 'music',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let embed2 = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.distube.getQueue(interaction)

        if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now.')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
        if (queue.songs.length <= 1) return interaction.editReply({ embeds: [embed.setDescription('There is nothing to jump to.')] });

        const q = queue.songs
            .map((song, i) => `${i === 0 ? 'Now Playing:' : `${i}.`} \`${song.name}\` - \`${song.formattedDuration}\``)
            .join('\n')

        interaction.editReply({ embeds: [embed
            .setTitle('**Which song do you want to jump to?**')
            .setDescription(q)
        ]}).then(async () => {

            const filter = m => m.author.id === interaction.member.id;

            interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(collected => {

                let position = parseInt(collected.first().content);

                if (isNaN(position)) return interaction.editReply({ embeds: [embed2.setDescription('Please specify a valid song position.')] });
                if (position > queue.songs.length) return interaction.editReply({ embeds: [embed2.setDescription('The position you provided is longer than the queue.')] });
                if (position < 1) return interaction.editReply({ embeds: [embed2.setDescription('Please provide a position of at least 1.')] });

                queue.jump(position);

                interaction.editReply({ embeds: [embed2.setDescription(`Jumped to song position \`${position}\` in the queue.`)] });

            });
            
        }).catch(() => interaction.editReply({ embeds: [embed2.setDescription('You didn\'t choose anything after 30 seconds.') ]}) );

    }
}