import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

module.exports = {
    name: 'rockpaperscissors',
    description: 'Play rock paper scissors with the bot.',
    category: 'fun',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        const emojis = ['🪨', '📰', '✂'];
        let row = new ActionRowBuilder();

        emojis.forEach(emoji => { row.addComponents(new ButtonBuilder().setLabel(emoji).setStyle(1).setCustomId(emoji)); });


        interaction.editReply({ embeds: [embed.setDescription('Rock, Paper or Scissors?')], components: [row] }).then(async (reply: any) => {
            
            const filter = (button: any) => button.user.id == interaction.user.id;

            reply.awaitMessageComponent({ filter, max: 1, time: 30000, errors: ['time'] }).then((button: any) => {

                const emoji = button.customId;
                let playerChoice = emojis.indexOf(emoji);
                let botChoice = Math.floor(Math.random() * 3);

                if (playerChoice == botChoice) { interaction.editReply({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. It's a draw!`)], components: [] }); }
                else if (playerChoice == 0 && botChoice == 2 || playerChoice == 1 && botChoice == 0 || playerChoice == 2 && botChoice == 1) { interaction.editReply({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. You win!`)], components: [] }); }
                else { interaction.editReply({ embeds: [embed.setDescription(`You chose \`${emojis[playerChoice].toString()}\` and the bot chose \`${emojis[botChoice].toString()}\`. You lose!`)], components: [] }); }
            
            }).catch(() => { interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

        });
        
    }
}