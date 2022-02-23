const play = require('play-dl')
const { MessageEmbed } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice')

module.exports = {
    name: 'play',
    aliases: ['music' ,'p'],
    aliasesText: 'Music, P',
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

        try {
            let videoArgs = args.join(' ')
            let yt_info = await play.search(videoArgs, {
                limit: 1
            })

            let stream = await play.stream(yt_info[0].url)

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            })

            resource = createAudioResource(stream.stream, {
                inputType: stream.type
            })
            
            const player = createAudioPlayer()
            connection.subscribe(player)

            player.play(resource)

            let embed = new MessageEmbed()

                .setAuthor({name:`\u25BA Now Playing:`})
                .setTitle(`${yt_info[0].title}`)
                .setDescription(`Duration: ${yt_info[0].durationRaw}`)
                .setFooter({text:`${yt_info[0].channel.name} | ${yt_info[0].uploadedAt}`})
                .setURL(`${yt_info[0].url}`)
                .setImage(`https://img.youtube.com/vi/${yt_info[0].id}/maxresdefault.jpg`)

            message.channel.send({
                embeds: [embed]
            })

        } catch(e) {
            message.channel.send(`There was an error trying to play.`)
            console.log(e)
        }
    }
}