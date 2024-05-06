import { Client, type Command, GatewayIntentBits, Partials, EmbedBuilder, ActivityType, Collection, BaseInteraction, type PresenceData } from 'discord.js';
import { Queue } from 'play-dl';

import { commandLoader } from './handlers/commandLoader';
import { getPresence } from './utils';

const client = new Client({
    partials: [Partials.Channel],
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ]
 });

client.commands = new Collection<string, Command>();
client.categories = new Collection<string, string[]>();
client.devs = process.env.DEVS?.split(',') || [];
client.embedColor = '#fbd55a';
client.queue = new Collection<string, Queue>();
client.musicquiz = [];
client.volume = 0.3;

process.on('uncaughtException', (e) => 
    client.devs.forEach((dev: string) => 
        client.users.cache.get(dev)?.send({ embeds: [new EmbedBuilder().setTitle('Error').setDescription(`\`\`\`${e.stack}\`\`\``).setColor(client.embedColor)] })
    )
);

client
    .on('ready', async () => {
        commandLoader(client);
        client.user?.setPresence(getPresence(client));
        console.log(`Logged in as ${client.user?.tag}.`);
    })
    .on('interactionCreate', (interaction: BaseInteraction) => require('./events/interactionCreate').default(client, interaction))
    .on('guildCreate', () => client.user?.setPresence(getPresence(client)))
    .on('guildDelete', () => client.user?.setPresence(getPresence(client)));

client.login(process.env.DISCORD_TOKEN);