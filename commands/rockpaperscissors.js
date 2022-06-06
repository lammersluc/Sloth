const { MessageEmbed } = require("discord.js")
const { sleep } = require('../addons.js')

module.exports = {
    name: 'rockpaperscissors',
    helpname: 'Rock Paper Scissors',
    aliases: ['rps'],
    aliasesText: 'RPS',
    description: 'Play rock paper scissors with the bot.',
    usage: 'RockPaperScissors [Rock/Paper/Scissors]',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor(client.embedColor)

        message.channel.send({ embeds: [embed.setDescription('Rock, Paper or Scissors?')] }).then(async msg => {
            await msg.react('🪨')
            await msg.react('📰')
            await msg.react('✂')
            await sleep(100)
            await msg.awaitReactions({ max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    let playerChoise
                    let botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]
                    if (reaction.emoji.name === '🪨') {
                        playerChoise = 'rock'
                    } else if (reaction.emoji.name === '📰') {
                        playerChoise = 'paper'
                    } else if (reaction.emoji.name === '✂') {
                        playerChoise = 'scissors'
                    }

                    if (playerChoise === botChoice) {
                        msg.edit({ embeds: [embed.setDescription(`You chose ${playerChoise} and the bot chose ${botChoice}. It's a draw!`)] })
                    } else if (playerChoise === 'rock' && botChoice === 'scissors' || playerChoise === 'paper' && botChoice === 'rock' || playerChoise === 'scissors' && botChoice === 'paper') {
                        msg.edit({ embeds: [embed.setDescription(`You chose ${playerChoise} and the bot chose ${botChoice}. You win!`)] })
                    } else {
                        msg.edit({ embeds: [embed.setDescription(`You chose ${playerChoise} and the bot chose ${botChoice}. You lose!`)] })
                    }
                }).catch(collected => {
                    msg.edit({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.') ]})
                })
        })
    }
}