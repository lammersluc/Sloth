const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  helpname: 'Skip',
  aliases: ['next'],
  aliasesText: 'Next',
  description: 'Skips to the next song.',
  usage: 'Skip',
  enabled: true,
  visible: true,
  devOnly: false,
  adminOnly: false,
  run: async (client, message, args) => {
    let embed = new EmbedBuilder().setColor(client.embedColor);
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing right now')] });
    if (!queue.songs[1]) {
      client.distube.voices.leave(message);
      return message.channel.send({ embeds: [embed.setDescription('There is nothing in the queue to skip to. So the bot has left the voice channel.')] });
    }

    await queue.skip();

    message.channel.send({ embeds: [embed.setDescription('Skipped.')] });
  }
}