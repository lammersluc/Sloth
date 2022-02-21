const axios = require('axios')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'reddit',
    aliases: ['r/'],
    description: 'Searches a random post from subreddit.',
    usage: 'Reddit (Subreddit)',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        if(!args[0]) {
            return message.channel.send(`Supply a Subreddit`)
        }

        try {
            let data = await axios.get(`https://www.reddit.com/r/${args[0]}/random/.json`)
            let embed = new MessageEmbed()

                .setAuthor({name:`${data.data[0].data.children[0].data.subreddit_name_prefixed} | ${moment(Number(data.data[0].data.children[0].data.created * 1000)).format('Do MMMM YYYY, h:mm a')}`})
                .setTitle(`${data.data[0].data.children[0].data.title}`)
                .setDescription(`${data.data[0].data.children[0].data.selftext}`)
                .setFooter({text:`u/${data.data[0].data.children[0].data.author} | ${data.data[0].data.children[0].data.ups} Upvotes | ${data.data[0].data.children[0].data.num_comments} Comment(s)`})
                .setURL(`https://www.reddit.com${data.data[0].data.children[0].data.permalink}`)

                if(data.data[0].data.children[0].data.is_video === false) embed.setImage(`${data.data[0].data.children[0].data.url}`)

            message.channel.send({
                embeds: [embed]
            })

            if(data.data[0].data.children[0].data.is_video === true) {
                message.channel.send(`https://www.reddit.com${data.data[0].data.children[0].data.permalink}`)
            }

        } catch(e) {
            message.channel.send('Subreddit doesn\'t exist')
        }
    }
}