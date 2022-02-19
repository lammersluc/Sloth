require('./addons')
const express = require('express')
const app = express()
const port = 8080
const Discord = require('discord.js')
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, , Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')

client.prefix = '$'
client.commands = new Discord.Collection()
client.usage = new Discord.Collection()
client.aliases = new Discord.Collection()
client.devs = ['431882442035691550']

client.on('ready', () => {
  fs.readdirSync('./commands').map(file => {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    for(let alias in command.aliases) {
      client.aliases.set(command.aliases[alias], command.name)
    }
  })
  client.user.setActivity('$Help for commands')
  console.log(client.commands)
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', message => {
  require('./event/messageCreate') (client, message)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
client.login('OTAwMTA4NzM5MzcyMjY1NTEy.YW8hlg.aIJc46zAiRJo0D4FlW7W2Pbuzxc')