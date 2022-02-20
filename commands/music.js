module.exports = {
    name: 'play',
    aliases: ['music', 'add'],
    description: 'Plays youtube video in your voice channel.',
    usage: 'Play (Search/URL)',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const { channel } = message.member.voice
        if (!channel) {
            return message.channel.send('You are not in a voice channel.')
        }


    }
}