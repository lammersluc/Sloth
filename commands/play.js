const fs = require('fs')
const ytdl = require('ytdl-core')
const YTK = require('yt-toolkit')
const Query = new YTK.Query(process.env.YOUTUBEAPI)
const moment = require('moment')
const { join } = require('path')
const { MessageEmbed } = require('discord.js')
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

        message.channel.send('Searching...')

        Query.Search(args.join(' '), async (Results) => {

        try {

            ytdl(Results[0].Video.URL).pipe(fs.createWriteStream('./audio/audio.mp3', { quality: 'lowestvideo', quality: 'highestaudio' }))
            await sleep(2000)

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

            player.play(resource)

            let embed = new MessageEmbed()

                .setAuthor({name:`Now Playing:`})
                .setTitle(`${Results[0].Video.Title}`)
                .setDescription(`${Results[0].Video.Description}`)
                .setFooter({text:`${Results[0].Video.Channel.Name} | ${moment(Results[0].Video.Date).format('Do MMMM YYYY, h:mm a')}`})
                .setURL(`${Results[0].Video.URL}`)
                .setImage(`https://img.youtube.com/vi/${Results[0].Video.ID}/maxresdefault.jpg`)

            message.channel.send({
                embeds: [embed]
            })

                
            } catch(e) {
                message.channel.send(`There was an error trying to play.`)
            }
        })
    }
}