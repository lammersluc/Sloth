require('dotenv').config();
require('./utils.js');
const { commandLoader } = require('./handlers/commandLoader.js');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const client = new Client({ partials: [Partials.Channel], intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions] });
const { DisTube } = require('distube');

client.commands = new Discord.Collection();
client.devs = ['431882442035691550', '388755086462943232'];
client.embedColor = '#fbd55a';
client.musicquiz = [];

client.distube = new DisTube(client, {

  leaveOnEmpty: true,
  emptyCooldown: 0,
  leaveOnFinish: true,
  leaveOnStop: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  savePreviousSongs: false,

});

process.on('uncaughtException', (e) => {

  console.log(e);

  client.devs.forEach(dev => {

    if (dev === '388755086462943232') return;

    client.users.cache.get(dev).send({ embeds: [new EmbedBuilder().setTitle('Error').setDescription(`\`\`\`${e.stack}\`\`\``).setColor(client.embedColor)] });

  });

});

setInterval(() => { client.user.setPresence({ activities: [{ name: `/Help | ${client.guilds.cache.size} Guilds`, type: ActivityType.Listening }], status: 'online' }); }, 60 * 60000);

client
  .on('ready', async () => {

    commandLoader(client);

    client.user.setPresence({ activities: [{ name: `/Help | ${client.guilds.cache.size} Guilds`, type: ActivityType.Listening }], status: 'online' });
    console.log(`Logged in as ${client.user.tag}.`);

  })

  .on('interactionCreate', interaction => { return require('./events/interactionCreate.js') (client, interaction); })

  .on('messageCreate', message => {

    if (message.channel.parentId === '984118604805050398') return require('./events/ticketMessageCreate.js') (client, message);
    if (message.channel.type === 1) return require('./events/dmMessageCreate.js') (client, message);

  })

  .on('channelDelete', channel => {

    if (channel.parentId === '984118604805050398') require('./events/ticketClose.js') (client, channel);

  })

  .on('guildDelete', () => {

    client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' });

  });


client.login(process.env.DISCORD_TOKEN);