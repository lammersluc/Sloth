require('dotenv').config();
require('./addons.js');
const fs = require('fs');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const client = new Client({ partials: [Partials.Channel], intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions] });
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

client.prefix = '.';
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.devs = ['431882442035691550'];
client.embedColor = '#fbd55a';
client.musicquiz = false;

client.distube = new DisTube(client, {

  leaveOnEmpty: true,
  emptyCooldown: 0,
  leaveOnFinish: true,
  leaveOnStop: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  savePreviousSongs: false,
  plugins: [
    new SpotifyPlugin({
      parallel: true,
      emitEventsAfterFetching: false,
      api: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
      }
    })
  ]

});

process.on('uncaughtException', (err) => {

  console.log(err);

  client.devs.forEach(dev => {

    client.users.cache.get(dev).send({ embeds: [new EmbedBuilder().setTitle('Error').setDescription(`\`\`\`${err.stack}\`\`\``).setColor(client.embedColor)] });

  });

});

setInterval(() => { client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' }); }, 3 * 60000);

client
  .on('ready', async () => {

    fs.readdirSync('./commands').map(file => {
      const command = require(`./commands/${file}`);

      client.commands.set(command.name, command);

      for(let alias in command.aliases) { client.aliases.set(command.aliases[alias], command.name); }

    });

  client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' });

  console.log(`Logged in as ${client.user.tag}.`);

})

  .on('messageCreate', message => {

    if (message.channel.parentId === '984118604805050398') return require('./events/ticketMessageCreate.js') (client, message);
    if (message.channel.type === 1) return require('./events/dmMessageCreate.js') (client, message);
    if (message.channel.type === 0) return require('./events/messageCreate.js') (client, message);

  })

  .on('channelDelete', channel => {

    if (channel.parentId === '984118604805050398') require('./events/ticketClose.js') (client, channel);

  })

  .on('guildCreate', guild => {

    const channel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

    channel.send({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription('Thanks for adding me to the server. Feel free to dm the bot for support.')] });

    client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' });

  })

  .on('guildDelete', () => {

    client.user.setPresence({ activities: [{ name: `${client.prefix}Help | ${client.guilds.cache.size} Guilds` }], status: 'online' });

  });

client.distube
  .on('playSong', (queue, song) => {

    if (client.musicquiz) return

    queue.textChannel.send({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: 'Now Playing' })
          .setTitle(`\`${song.name}\` - \`${song.uploader.name}\``)
          .setURL(song.url)
          .setDescription(`\`⚪─────────────────────────────────────────────────\`\n\`${song.views.toLocaleString()} 👀 | ${song.likes.toLocaleString()} 👍 | 0:00 / ${song.formattedDuration} | 🔊 ${queue.volume}%\``)
          .setThumbnail(song.thumbnail)
          .setTimestamp()
          .setFooter({ text: `${song.user.username}#${song.user.discriminator}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: "png" }) })
          .setColor(client.embedColor)]
    });

  })

  .on('finishSong', (queue) => {
    if (client.musicquiz) return;
    if (queue.songs.length <= 1) queue.textChannel.send({ embeds: [new EmbedBuilder().setDescription('The bot has left the voice channel.').setColor(client.embedColor)] });

  })

  .on('error', (textChannel, e) => {

    if (e.toLocaleString().includes('PlayingError: Sign in to confirm your age')) return textChannel.send({embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription(`The video you are trying to play is age restricted. Skipping to next song...`)] })
    
    client.devs.forEach(dev => {

      client.users.cache.get(dev).send({ embeds: [new EmbedBuilder().setTitle('Error').setDescription(`\`\`\`${e.stack}\`\`\``).setColor(client.embedColor)] });

    });
    
  });

client.login(process.env.TOKEN);