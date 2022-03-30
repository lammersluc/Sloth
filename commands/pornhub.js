const porny = require('porny')

module.exports = {
    name: 'porn',
    aliases: [''],
    aliasesText: '',
    description: 'Search for a porn image.',
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
                message.channel.send(res[0].url)
            }).catch((err) => {
                message.channel.send('There was no image found.')
            })
        } else {
            message.channel.send('Channel must be NSFW.')
        }
    }
}