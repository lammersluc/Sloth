module.exports = {
    name: 'dm',
    aliases: ['directmessage'],
    aliasesText: 'Directmessage',
    description: 'Get a \'hi\' in you direct message.',
    usage: 'dm',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        message.author.send('Hi!')
    }
}