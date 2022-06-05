const { RepeatMode } = require("distube")
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'repeat',
  helpname: 'Repeat',
  aliases: ['loop' ,'rp'],
  aliasesText: 'Loop, RP',
  description: 'Switches the repeat mode',
  usage: 'Repeat [1 / 2 / 3]',
  enabled: true,
  visible: true,
  devOnly: false,
  servAdmin: false,
  run: async (client, message, args) => {
    let embed = new MessageEmbed().setColor(client.embedColor)
    if (!client.distube.getQueue(message)) {
      return message.channel.send({ embeds: [embed.setTitle('There is nothing playing in the queue.')] })
    }
    if (parseInt(args[0]) !== 0 && parseInt(args[0]) !== 1 && parseInt(args[0]) !== 2) {
      return message.channel.send({ embeds: [embed.setTitle('Please specify a valid mode (0, 1 or 2).')] })
    }
    let mode
    switch(client.distube.setRepeatMode(message, parseInt(args[0]))) {
        case RepeatMode.DISABLED:
            mode = 'Off'
            break
        case RepeatMode.SONG:
            mode = 'Repeat a song'
            break
        case RepeatMode.QUEUE:
            mode = 'Repeat all queue'
            break
    }
    message.channel.send({ embeds: [embed.setTitle(`Set repeat mode to \`${mode}\`.`)] })
  }
}