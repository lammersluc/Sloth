module.exports = {
    name: 'play',
    aliases: ['add', 'music' ,'p'],
    aliasesText: 'Add, Music, P',
    description: 'Plays music in your voice channel',
    usage: 'Play (Search/URL)',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const string = args.join(' ')
        if (!string) return message.channel.send(`Please enter a song url or query to search.`)
        client.distube.play(message.member.voice.channel, string, {
          member: message.member,
          textChannel: message.channel,
          message
        })
    }
}