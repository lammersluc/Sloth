module.exports = {
    name: 'rockpaperscissors',
    helpname: 'Rock Paper Scissors',
    aliases: ['rps'],
    aliasesText: 'RPS',
    description: 'Play rock paper scissors with the bot.',
    usage: 'RockPaperScissors (Rock/Paper/Scissors)',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new MessageEmbed()

            .setTitle('Rock Paper Scissors')

        message.channel.send({
            embeds: [embed]
        }).then(msg => {
            msg.react(':fist:')
            msg.react(':raised_back_of_hand:')
            msg.react(':v:')
        })
    }
}