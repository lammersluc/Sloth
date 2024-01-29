require('dotenv').config();
require('./utils.js').default;
const { commandLoader } = require('./handlers/commandLoader.js');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const client = new Client({ partials: [Partials.Channel], intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions] });
client.commands = new Discord.Collection();
client.devs = process.env.DEVS.split(',');
client.embedColor = '#fbd55a';
client.queue = new Map();
client.musicquiz = [];
client.volume = 0.3;

process.on('uncaughtException', (e) => {
    
    client.devs.forEach(dev => {

        client.users.cache.get(dev).send({ embeds: [new EmbedBuilder().setTitle('Error').setDescription(`\`\`\`${e.stack}\`\`\``).setColor(client.embedColor)] });

    });

});

client
    .on('ready', async () => {

        commandLoader(client);

        client.user.setPresence({ activities: [{ name: `/Help | ${client.guilds.cache.size} Guilds`, type: ActivityType.Listening }], status: 'online' });
        console.log(`Logged in as ${client.user.tag}.`);

    })

    .on('interactionCreate', interaction => require('./events/interactionCreate.js') (client, interaction))

    .on('guildCreate', () => client.user.setPresence({ activities: [{ name: `/Help | ${client.guilds.cache.size} Guilds` }], status: 'online' }))
        
    .on('guildDelete', () => client.user.setPresence({ activities: [{ name: `/Help | ${client.guilds.cache.size} Guilds` }], status: 'online' }))

client.login(process.env.DISCORD_TOKEN);