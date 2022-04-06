require('dotenv').config()
require('./addons')
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]})
const fs = require('fs')
const { DisTube } = require('distube')

client.prefix = '$'
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.alias = new Discord.Collection()
client.devs = ['431882442035691550']

client.distube = new DisTube(client, {
  leaveOnStop: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
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
  client.user.setActivity(`${client.prefix}Help for commands`)
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', message => {
  require('./event/messageCreate') (client, message)
})

client.on("guildCreate", guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send("Thanks for adding me to the server.")
})

client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `Now playing: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user}`
    )
  )

  .on('addSong' , (queue, song) =>
    queue.textChannel.send(
      `Added song: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user}`
    )
  )

  .on('empty', channel => channel.send('Voice channel is empty. Leaving the channel...'))

  .on('searchNoResult', (message, query) =>
    message.channel.send(`No result found for \`${query}\`.`)
  )

client.login(process.env.TOKEN)