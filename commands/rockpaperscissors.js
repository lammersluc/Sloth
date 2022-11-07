const { EmbedBuilder } = require('discord.js');
const { sleep } = require('../addons.js');

module.exports = {
    name: 'rockpaperscissors',
    helpname: 'Rock Paper Scissors',
    aliases: ['rps'],
    aliasesText: 'RPS',
    description: 'Play rock paper scissors with the bot.',
    usage: 'RockPaperScissors',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const emojis = ['🪨', '📰', '✂'];

        message.channel.send({ embeds: [embed.setDescription('Rock, Paper or Scissors?')] }).then(async msg => {
            emojis.map(emoji => {msg.react(emoji);});
            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
            await msg.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    let playerChoice = emojis.indexOf(reaction.emoji.name);
                    let botChoice = Math.floor(Math.random() * 3);

                    if (playerChoice === botChoice) {
                        msg.edit({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. It's a draw!`)] });
                    } else if (playerChoice === 0 && botChoice === 2 || playerChoice === 1 && botChoice === 0 || playerChoice === 2 && botChoice === 1) {
                        msg.edit({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. You win!`)] });
                    } else {
                        msg.edit({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. You lose!`)] });
                    }
                }).catch(collected => {
                    msg.edit({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.') ]});
            })
        })
    }
}