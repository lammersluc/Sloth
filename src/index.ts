import { Client, type Command, GatewayIntentBits, Partials, EmbedBuilder, ActivityType, Collection, BaseInteraction, type PresenceData, ChatInputCommandInteraction } from 'discord.js';

import { commandLoader } from './handlers/commandLoader';
import { getPresence } from './utils';
import { Player } from 'discord-player';

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
client.musicquiz = [];
client.volume = 0.3;

process.on('uncaughtException', (e) => 
    client.devs.forEach((dev: string) => 
        client.users.cache.get(dev)?.send({ embeds: [new EmbedBuilder().setTitle('Error').setDescription(`\`\`\`${e.stack}\`\`\``).setColor(client.embedColor)] })
    )
);

const player = new Player(client);
await player.extractors.loadDefault();
player.events.on('playerStart', (queue, track) =>
    (queue.metadata as ChatInputCommandInteraction).channel?.send({ embeds: [new EmbedBuilder()
        .setAuthor({ name: 'Added song' })
        .setTitle(`\`${track.title}\` - \`${track.author}\``)
        .setDescription(null)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .setTimestamp()
        .setFooter({ text: track?.requestedBy?.username ?? '', iconURL: track.requestedBy?.displayAvatarURL()})]
    })
).on('error', (_, error) =>
    console.log(error)
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