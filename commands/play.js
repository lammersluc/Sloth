const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'play',
  helpname: 'Play',
  aliases: ['add', 'music' ,'p'],
  aliasesText: 'Add, Music, P',
  description: 'Plays music in your voice channel.',
  usage: 'Play [Search/URL]',
  enabled: true,
  visible: true,
  devOnly: false,
  servAdmin: false,
  run: async (client, message, args) => {
    let embed = new EmbedBuilder().setColor(client.embedColor);
    let embed2 = new EmbedBuilder().setColor(client.embedColor);
    const string = args.join(' ');
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] });
    if (!string) return message.channel.send({ embeds: [embed.setDescription('Please provide a song url or query to search.')] });

    await client.distube.search(string, {limit: 5}).then(async (results) => {
      if (!results.length) return message.channel.send({ embeds: [embed.setDescription('No results found.')] });
      const list = results
        .map((song, i) => `${i+1}. \`${song.name}\` - \`${song.formattedDuration}\``)
        .join('\n\n');
      message.channel.send({ embeds: [embed.setTitle('**Which song do you want to play?**').setDescription(list)] }).then(async (msg) => {
        await message.channel.awaitMessages({ max: 1, time: 30000, errors: ['time'] }).then(collected => {
          let songNumber = parseInt(collected.first().content);
          if (isNaN(songNumber)) return msg.edit({ embeds: [embed2.setDescription('Please specify a valid song number.')] });
          if (songNumber > results.length) return msg.edit({ embeds: [embed2.setDescription('The song number you provided is longer than the amount of results.')] });
          if (songNumber < 1) return msg.edit({ embeds: [embed2.setDescription('Please provide a song number of at least 1.')] });
          const song = results[songNumber - 1]

          if (!message.member.voice.channel.permissionsFor(message.guild.me).has('CONNECT') || !message.member.voice.channel.permissionsFor(message.guild.me).has('SPEAK')) return msg.edit({ embeds: [embed2.setDescription('I do not have permission to join or speak in this voice channel.')] });

          client.distube.play(message.member.voice.channel, song, {
            member: message.member,
            textChannel: message.channel,
            message
          });
        }).catch(collected => {
          msg.edit({ embeds: [embed2.setDescription('You didn\'t choose anything after 30 seconds.')] });
        });
      });
    });
  }
}