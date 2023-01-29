const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  name: 'play',
  description: 'Plays music in your voice channel.',
  category: 'music',
  options: [{ name: 'search', type: 'string', required: true }],
  enabled: true,
  devOnly: false,
  adminOnly: false,
  run: async (client, interaction) => {

    let embed = new EmbedBuilder().setColor(client.embedColor);
    const string = interaction.options.getString('search');
    const voiceChannel = interaction.member.voice.channel;
    let song;

    if (!voiceChannel) return interaction.editReply({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
    if (!interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect) || !interaction.member.voice.channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply({ embeds: [embed.setDescription('I do not have permission to join or speak in this voice channel.')] });
    if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

    try {

      if (string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {

        result = await client.distube.search(string, {limit: 1});
        song = result[0]
        if (song.age_restricted) return interaction.editReply({ embeds: [embed.setDescription(`The video you are trying to play is age restricted.`)] });

        interaction.editReply({ embeds: [embed

            .setAuthor({ name: 'Added Song' })
            .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })]

          });

        return client.distube.play(voiceChannel, string, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction
        });

      }
    
      await client.distube.search(string, {limit: 5}).then(async (results) => {
        const list = results
          .map((song, i) => `${i+1}. \`${song.name}\` - \`${song.formattedDuration}\``)
          .join('\n\n')

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();

        results.map(result => { row.addComponents(new ButtonBuilder().setLabel((results.indexOf(result) + 1).toString()).setStyle('Primary').setCustomId(results.indexOf(result).toString())); });
        row2.addComponents(new ButtonBuilder().setLabel('❌').setStyle('Primary').setCustomId('cancel'));

        interaction.editReply({ embeds: [embed.setTitle(`**Which song do you want to play?**`).setDescription(list)], components: [row, row2] }).then(msg => {
          const filter = (button) => button.user.id === interaction.user.id;

          collector = msg.createMessageComponentCollector({ filter, time: 30000 })
          collector.on('collect', (button) => {

            collector.stop();

            if (button.component.customId === 'cancel') return interaction.editReply({ embeds: [embed.setDescription('Cancelled.')], components: [] });

            const song = results[parseInt(button.customId)];
            if (song.age_restricted) return interaction.editReply({ embeds: [embed.setDescription(`The video you are trying to play is age restricted.`)] });
        
            interaction.editReply({ embeds: [embed

                .setAuthor({ name: 'Added Song' })
                .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
                .setURL(song.url)
                .setDescription(null)
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, format: "png" }) })], components: []

              });
          
            client.distube.play(interaction.member.voice.channel, song, {

              member: interaction.member,
              textChannel: interaction.channel,
              interaction

            });

          })
          
          collector.on('end', c => { if (c.size === 0) interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

        });

      });

    } catch (e) {

      if (e.toLocaleString().includes('DisTubeError [NO_RESULT]: No result found')) return interaction.editReply({ embeds: [embed.setDescription(`No results found for \`${string}\`.`)] });
      if (e.toLocaleString().includes('PlayingError: Sign in to confirm your age')) return interaction.editReply({embeds: [embed.setDescription(`The video you are trying to play is age restricted.`)] });

    }

  }
}