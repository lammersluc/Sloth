const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'rockpaperscissors',
    helpname: 'Rock Paper Scissors',
    aliases: ['rps'],
    aliasesText: 'RPS',
    description: 'Play rock paper scissors with the bot.',
    category: 'fun',
    usage: 'RockPaperScissors',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        const emojis = ['🪨', '📰', '✂'];
        let row = new ActionRowBuilder();

        emojis.map(emoji => { row.addComponents(new ButtonBuilder().setLabel(emoji).setStyle('Primary').setCustomId(emoji)); });


        message.channel.send({ embeds: [embed.setDescription('Rock, Paper or Scissors?')], components: [row] }).then(async msg => {
            
            const filter = (button) => button.user.id === message.author.id;

            msg.awaitMessageComponent({ filter, max: 1, time: 30000, errors: ['time'] }).then(button => {

                const emoji = button.customId;
                let playerChoice = emojis.indexOf(emoji);
                let botChoice = Math.floor(Math.random() * 3);

                if (playerChoice === botChoice) { msg.edit({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. It's a draw!`)], components: [] }); }
                else if (playerChoice === 0 && botChoice === 2 || playerChoice === 1 && botChoice === 0 || playerChoice === 2 && botChoice === 1) { msg.edit({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. You win!`)], components: [] }); }
                else { msg.edit({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. You lose!`)], components: [] }); }
            
            }).catch(() => { msg.edit({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

        });
        
    }
}