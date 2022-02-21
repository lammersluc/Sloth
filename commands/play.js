const fs = require('fs')
const ytdl = require('ytdl-core')
const { join } = require('path')
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')

module.exports = {
    name: 'play',
    aliases: ['p' ,'music'],
    description: 'Plays music in your voice channel',
    usage: 'Play (Search/URL)',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {

        const channel = await message.member.voice.channel

        if(!channel) {
            return message.channel.send('You are not in any voice channel.')
        }

        const url = args.join('')

        try {
            ytdl(url).pipe(fs.createWriteStream('../audio.mp3'))
        } catch(e) {
            message.channel.send('URL not found.')
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })

        resource = createAudioResource(join('../audio.mp3'), { inlineVolume: true })
        console.log
        resource.volume.setVolume(0.5)

        const player = createAudioPlayer()
        connection.subscribe(player)

        try {
            player.play(resource)
            message.channel.send('The bot started playing.')
            
        } catch (e) {
            message.channel.send('There was an error trying to play.')
        }
    }
}