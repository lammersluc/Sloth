const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  name: 'play',
  helpname: 'Play',
  aliases: ['add', 'music' ,'p'],
  aliasesText: 'Add, Music, P',
  description: 'Plays music in your voice channel.',
  category: 'music',
  usage: 'Play [Search/URL]',
  enabled: true,
  visible: true,
  devOnly: false,
  adminOnly: false,
  run: async (client, message, args) => {
    let embed = new EmbedBuilder().setColor(client.embedColor);
    const string = args.join(' ');
    const voiceChannel = message.member.voice.channel;
    let song;
    if (!voiceChannel) return message.channel.send({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
    if (!message.member.voice.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect) || !message.member.voice.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) return message.channel.send({ embeds: [embed.setDescription('I do not have permission to join or speak in this voice channel.')] });
    if (!string) return message.channel.send({ embeds: [embed.setDescription('Please provide a song url or query to search.')] });

    try { 
      if (string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
        result = await client.distube.search(string, {limit: 1});
        song = result[0]
        message.channel.send({
          embeds: [embed
            .setAuthor({ name: 'Added Song' })
            .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setTimestamp()
            .setFooter({ text: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png" }) })] });

        return client.distube.play(message.member.voice.channel, string, {
          member: message.member,
          textChannel: message.channel,
          message
        });
      }
    
      await client.distube.search(string, {limit: 5}).then(async (results) => {
      const list = results
        .map((song, i) => `${i+1}. \`${song.name}\` - \`${song.formattedDuration}\``)
        .join('\n\n')

        let row = new ActionRowBuilder();
        let row2 = new ActionRowBuilder();
        results.map(result => {
          row.addComponents(new ButtonBuilder().setLabel((results.indexOf(result) + 1).toString()).setStyle('Primary').setCustomId(results.indexOf(result).toString()));
        });
        row2.addComponents(new ButtonBuilder().setLabel('❌').setStyle('Primary').setCustomId('cancel'));

        message.channel.send({ embeds: [embed.setTitle(`**Which song do you want to play?**`).setDescription(list)], components: [row, row2] }).then(msg => {
          const filter = (button) => button.user.id === message.author.id;
          msg.awaitMessageComponent({ filter, time: 30000, errors: ['time'] }).then(button => {
            if (button.customId === 'cancel') return msg.edit({ embeds: [embed.setDescription('Cancelled.')], components: [] });
            song = results[parseInt(button.customId)];
        
            msg.edit({
              embeds: [embed
                .setAuthor({ name: 'Added Song' })
                .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
                .setURL(song.url)
                .setDescription(null)
                .setThumbnail(song.thumbnail)
                .setTimestamp()
                .setFooter({ text: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png" }) })], components: [] });
          
            client.distube.play(message.member.voice.channel, song, {
              member: message.member,
              textChannel: message.channel,
              message
            });
          }).catch(() => {
            msg.edit({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] });
          });
        });
      });
    } catch (e) {
      if (e.toLocaleString().includes('DisTubeError [NO_RESULT]: No result found')) return message.channel.send({ embeds: [embed.setDescription(`No results found for \`${string}\`.`)] });
    }
  }
}