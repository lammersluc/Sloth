module.exports = {
    name: 'random',
    aliases: ['rng'],
    aliasesText: 'Rng',
    description: 'Chooses a randum number between 1 and the argument',
    usage: 'Random (Max output)',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {

        let random = Math.round(Math.random() * args[0] + 1)

        if (isNaN(random) || !args[0]) {
            if (!args[0]) {
                return message.channel.send('Supply a number')
            }

            return message.channel.send('Supply a valid number')
        }

        message.channel.send(`A random number between 1 and ${args[0]} is ${random}`)
    }
}