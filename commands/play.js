const fs = require('fs')
const ytdl = require('ytdl-core')
const YTK = require('yt-toolkit')
const Query = new YTK.Query(process.env.YOUTUBEAPI)
const { join } = require('path')
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const sleep = ms => new Promise(r => setTimeout(r, ms));

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


        Query.Search(args.join(' '), async (Results) => {
            let url = Results[0].Video.URL
            let videoName = Results[0].Video.Title

            try {
                ytdl(url).pipe(fs.createWriteStream('./audio/audio.mp3', { quality: 'lowestvideo', quality: 'highestaudio' }))
                await sleep(2000)
            } catch(e) {
                message.channel.send(`There was an error trying to play **${videoName}**.`)
            }

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            })

            resource = createAudioResource(join('./audio/audio.mp3'), { inlineVolume: true })
            console.log
            resource.volume.setVolume(0.5)

            const player = createAudioPlayer()
            connection.subscribe(player)

            try {
                player.play(resource)
                message.channel.send(`The bot started playing **${videoName}**.`)
                
            } catch (e) {
                message.channel.send('There was an error trying to play.')
            }
        })
    }
}