const porny = require('porny')

module.exports = {
    name: 'porn',
    aliases: [''],
    aliasesText: '',
    description: 'Search for a random porn image.',
    usage: 'Porn (Search)',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        if (message.channel.nsfw) {
            porny.get({
                search: args.join(''),
            }).then((res) => {
                random = Math.round(Math.random * res.size)
                message.channel.send(res[random].url)
            }).catch((err) => {
                message.channel.send('There was no image found.')
            })
        } else {
            message.channel.send('Channel must be NSFW.')
        }
    }
}