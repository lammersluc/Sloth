const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const moment = require('moment');

module.exports = {
    name: 'reddit',
    description: 'Searches a random post from subreddit.',
    category: 'fun',
    options: [
        {
            name: 'subreddit',
            type: 'string',
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder();

        try {
            
            let data = await axios.get(`https://www.reddit.com/r/${interaction.options.getString('subreddit')}/random/.json`);
            let url = '';

            if (data.data[0].data.children[0].data.url.includes('i.redd.it')) embed.setImage(`${data.data[0].data.children[0].data.url}`);
            else url = data.data[0].data.children[0].data.url;
            
            embed
                .setAuthor({name:`${data.data[0].data.children[0].data.subreddit_name_prefixed} | ${moment(Number(data.data[0].data.children[0].data.created * 1000)).format('Do MMMM YYYY, h:mm a')}`})
                .setTitle(`${data.data[0].data.children[0].data.title}`)
                .setDescription(`${data.data[0].data.children[0].data.selftext}\n${url}`)
                .setFooter({text:`u/${data.data[0].data.children[0].data.author} | ${data.data[0].data.children[0].data.ups} Upvotes | ${data.data[0].data.children[0].data.num_comments} Comment(s)`})
                .setURL(`https://www.reddit.com${data.data[0].data.children[0].data.permalink}`)
                .setColor(client.embedColor);


            interaction.editReply({ embeds: [embed] });
            
        } catch(e) { interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription('Subreddit doesn\'t exist.')] }); console.log(e) }

    }
}