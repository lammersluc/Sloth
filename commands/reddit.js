const axios = require('axios');
const { EmbedBuilder, Embed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'reddit',
    helpname: 'Reddit',
    aliases: ['r/'],
    aliasesText: 'R/',
    description: 'Searches a random post from subreddit.',
    usage: 'Reddit [Subreddit]',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder();
        if(!args[0]) {
            return message.channel.send({ embeds: [embed.setColor(client.embedColor).setDescription(`Supply a Subreddit.`)] });
        }
        try {
            let data = await axios.get(`https://www.reddit.com/r/${args[0]}/random/.json`);
            embed
                .setAuthor({name:`${data.data[0].data.children[0].data.subreddit_name_prefixed} | ${moment(Number(data.data[0].data.children[0].data.created * 1000)).format('Do MMMM YYYY, h:mm a')}`})
                .setTitle(`${data.data[0].data.children[0].data.title}`)
                .setFooter({text:`u/${data.data[0].data.children[0].data.author} | ${data.data[0].data.children[0].data.ups} Upvotes | ${data.data[0].data.children[0].data.num_comments} Comment(s)`})
                .setURL(`https://www.reddit.com${data.data[0].data.children[0].data.permalink}`)
                .setColor(client.embedColor);

                if(data.data[0].data.children[0].data.is_video === false) embed.setImage(`${data.data[0].data.children[0].data.url}`);

            message.channel.send({
                embeds: [embed]
            });

            if(data.data[0].data.children[0].data.is_video === true) {
                message.channel.send(`https://www.reddit.com${data.data[0].data.children[0].data.permalink}`);
            }

        } catch(e) {
            message.channel.send({ embeds: [embed.setColor(client.embedColor).setDescription('Subreddit doesn\'t exist.')] });
        }
    }
}