const { MessageEmbed } = require("discord.js")

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

        if (!args[0] || !['rock', 'r',  'paper', 'p', 'scissors', 's'].includes(args[0].toLowerCase())) {
            return message.channel.send({ embeds: [embed.setDescription('Please choose Rock, Paper or Scissors.')] })
        }

        if (args[0].toLowerCase() === 'r') {
            playerChoise = 'rock'
        } else if (args[0].toLowerCase() === 'p') {
            playerChoise = 'paper'
        } else if (args[0].toLowerCase() === 's') {
            playerChoise = 'scissors'
        }

        let botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]

        if (playerChoise === botChoice) {
            return message.channel.send({ embeds: [embed.setDescription(`You chose ${playerChoise} and the bot chose ${botChoice}. It's a draw!`)] })
        } else if (playerChoise === 'rock' && botChoice === 'scissors' || playerChoise === 'paper' && botChoice === 'rock' || playerChoise === 'scissors' && botChoice === 'paper') {
            return message.channel.send({ embeds: [embed.setDescription(`You chose ${playerChoise} and the bot chose ${botChoice}. You win!`)] })
        } else {
            message.channel.send({ embeds: [embed.setDescription(`You chose ${playerChoise} and the bot chose ${botChoice}. You lose!`)] })
        }
    }
}