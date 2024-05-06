import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import moment from 'moment';

export default {
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Searches a random post from subreddit.')
        .addStringOption(option =>
            option.setName('subreddit')
                .setDescription('Enter the subreddit name')
                .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder();

        try {
            const data = await axios.get(`https://www.reddit.com/r/${interaction.options.getString('subreddit')}/random/.json`);
            let url = '';

            if (data.data[0].data.children[0].data.url.includes('i.redd.it')) {
                embed.setImage(`${data.data[0].data.children[0].data.url}`);
            } else {
                url = data.data[0].data.children[0].data.url;
            }

            embed
                .setAuthor({ name: `${data.data[0].data.children[0].data.subreddit_name_prefixed} | ${moment(Number(data.data[0].data.children[0].data.created * 1000)).format('Do MMMM YYYY, h:mm a')}` })
                .setTitle(data.data[0].data.children[0].data.title)
                .setDescription(`${data.data[0].data.children[0].data.selftext}\n${url}`)
                .setFooter({ text: `u/${data.data[0].data.children[0].data.author} | ${data.data[0].data.children[0].data.ups} Upvotes | ${data.data[0].data.children[0].data.num_comments} Comment(s)` })
                .setURL(`https://www.reddit.com${data.data[0].data.children[0].data.permalink}`)
                .setColor(client.embedColor);

            interaction.editReply({ embeds: [embed] });
        } catch (e) {
            interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription('Subreddit doesn\'t exist.')] });
            console.log(e);
        }
    }
}
