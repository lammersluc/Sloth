require('dotenv').config()
require('./addons')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]})
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const { DisTube } = require('distube')

client.prefix = '.'
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.alias = new Discord.Collection()
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

client.on('ready', () => {
  fs.readdirSync('./commands').map(file => {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    for(let alias in command.aliases) {
      client.aliases.set(command.aliases[alias], command.name)
    }
  })
  client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' })
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', message => {
  require('./events/messageCreate') (client, message)
})

client.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send("Thanks for adding me to the server.")
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