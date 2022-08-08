require('dotenv').config()
require('./addons')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js')
const client = new Client({ partials: ["CHANNEL"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]})
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const { DisTube } = require('distube')

client.prefix = '.'
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.devs = ['431882442035691550']
client.embedColor = '#00a8f3'

client.distube = new DisTube(client, {
  leaveOnEmpty: true,
  emptyCooldown: 0,
  leaveOnFinish: true,
  leaveOnStop: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  savePreviousSongs: false,
  plugins: [
  ],
  youtubeDL: false
})

process.on('uncaughtException', (err) => {
  client.devs.forEach(dev => {
    client.users.cache.get(dev).send({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`\`\`\`${err.stack}\`\`\``).setColor(client.embedColor)] })
  })
})

setInterval(() => {
  client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' })
}, 3 * 60000)

client.on('ready', () => {
  fs.readdirSync('./commands').map(file => {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    for(let alias in command.aliases) {
      client.aliases.set(command.aliases[alias], command.name)
    }
  })
  client.user.setActivity(`${client.prefix}Help | ${client.guilds.cache.size} Guilds` )
  console.log(`Logged in as ${client.user.tag}.`)
})

client.on('messageCreate', message => {
  if (message.channel.type === 'DM') return require('./events/dmMessageCreate.js') (client, message)
  if (message.channel.parentId === '984118604805050398') return require('./events/ticketMessageCreate.js') (client, message)
  require('./events/messageCreate.js') (client, message)
})

client.on('channelDelete', channel => {
  if (channel.parentId === '984118604805050398') require('./events/ticketClose.js') (client, channel)
})

client.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription('Thanks for adding me to the server. For support send a dm to the bot.')] })
  client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' })
})

client.on('guildDelete', guild => {
  client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' })
  })

client.distube
  .on('playSong', (queue, song) => {
    queue.textChannel.send({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Now Playing' })
          .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
          .setURL(song.url)
          .setDescription(`\`⚪──────────────────────────────────────────────────\`\n\`${song.views.toLocaleString()} 👀 | ${song.likes.toLocaleString()} 👍 | 0:00 / ${song.formattedDuration} | 🔊 ${queue.volume}%\``)
          .setThumbnail(song.thumbnail)
          .setTimestamp()
          .setFooter({ text: `${song.user.username}#${song.user.discriminator}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })
          .setColor('#00a8f3')]
    })
  })

  .on('addSong' , (queue, song) => {
    if (!queue.songs) return
    queue.textChannel.send({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Added Song' })
        .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: `${song.user.username}#${song.user.discriminator}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })
        .setColor('#00a8f3')]
  })
  })

  .on('searchNoResult', (message, query) =>
    message.channel.send(`No result found for \`${query}\`.`)
  )

client.login(process.env.TOKEN)