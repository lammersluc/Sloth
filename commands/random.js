module.exports = {
    name: 'random',
    aliases: ['rng'],
    aliasesText: 'Rng',
    description: 'Chooses a randum number between 1 and the input',
    usage: 'Random (Max output)',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {

        if(!args[0]) {
            return message.channel.send('Supply a number')
        }

        message.channel.send(`A randum number between 1 and ${args[0]} is ${Math.floor(Math.random() * args[0] + 1)}`)
    }
}