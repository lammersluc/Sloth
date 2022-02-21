const { joinVoiceChannel } = require('@discordjs/voice')
const { createAudioPlayer } = require('@discordjs/voice')
const { createAudioResource, StreamType } = require('@discordjs/voice')
const Voice = require('@discordjs/voice')
const fs = require('fs')

module.exports = {
    name: 'play',
    aliases: ['music'],
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

        const connection = await joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })

        message.channel.send('The bot has connected to voice channel.')

        const resource = createAudioResource('/File.mp3')
        const player = createAudioPlayer()

        try {
            player.play(resource)

             message.channel.send('Started playing.')
             
        } catch (e) {
            message.channel.send('There was an error trying to play.')
            console.log(e)
        }
    }
}