const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'repeat',
  helpname: 'Repeat',
  aliases: ['loop' ,'rp'],
  aliasesText: 'Loop, RP',
  description: 'Switches the repeat mode',
  usage: 'Repeat [0 / 1 / 2]',
  enabled: true,
  visible: true,
  devOnly: false,
  servAdmin: false,
  run: async (client, message, args) => {
    let embed = new MessageEmbed().setColor(client.embedColor)
    const queue = client.distube.getQueue(message)

    if (!queue) return message.channel.send({ embeds: [embed.setDescription('There is nothing playing in the queue.')] })
    let mode
    if (queue.repeatMode === 2) {
      queue.setRepeatMode()
      mode = 'Off'
    } else if (queue.repeatMode === 0) {
      queue.setRepeatMode()
      mode = 'Repeat a song'
    } else if (queue.repeatMode === 1) {
      queue.setRepeatMode()
      mode = 'Repeat the queue'
    }
    message.channel.send({ embeds: [embed.setDescription(`Set repeat mode to \`${mode}\`.`)] })
  }
}