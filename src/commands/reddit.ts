import { EmbedBuilder } from 'discord.js';
import moment from 'moment';

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
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder();

        try {
            
            const response = await fetch(`https://www.reddit.com/r/${interaction.options.getString('subreddit')}/random/.json`);
            const data = await response.json() as any;
            let url = '';

            if (data[0].data.children[0].data.url.includes('i.redd.it')) embed.setImage(`${data[0].data.children[0].data.url}`);
            else url = data[0].data.children[0].data.url;
            
            embed
                .setAuthor({name:`${data[0].data.children[0].data.subreddit_name_prefixed} | ${moment(Number(data[0].data.children[0].data.created * 1000)).format('Do MMMM YYYY, h:mm a')}`})
                .setTitle(`${data[0].data.children[0].data.title}`)
                .setDescription(`${data[0].data.children[0].data.selftext}\n${url}`)
                .setFooter({text:`u/${data[0].data.children[0].data.author} | ${data[0].data.children[0].data.ups} Upvotes | ${data[0].data.children[0].data.num_comments} Comment(s)`})
                .setURL(`https://www.reddit.com${data[0].data.children[0].data.permalink}`)
                .setColor(client.embedColor);


            interaction.editReply({ embeds: [embed] });
            
        } catch(e) { interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription('Subreddit doesn\'t exist.')] }); console.log(e) }

    }
}