const { MessageEmbed } = require("discord.js")

module.exports = {
  name: 'play',
  helpname: 'Play',
  aliases: ['add', 'music' ,'p'],
  aliasesText: 'Add, Music, P',
  description: 'Plays music in your voice channel',
  usage: 'Play [Search/URL]',
  enabled: true,
  visible: true,
  devOnly: false,
  servAdmin: false,
  run: async (client, message, args) => {
    let embed = new MessageEmbed().setColor(client.embedColor)
    const string = args.join(' ')
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) return message.channel.send({ embeds: [embed.setDescription(`You are currently not connected to any voice channel.`)] })
    if (!string) return message.channel.send({ embeds: [embed.setDescription('Please provide a song url or query to search.')] })
    client.distube.play(message.member.voice.channel, string, {
      member: message.member,
      textChannel: message.channel,
      message
    })
  }
}