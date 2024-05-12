import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reddit')
        .setDescription('Searches a random post from subreddit')
        .addStringOption(o => o
            .setName('subreddit')
            .setDescription('Subreddit to search for')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder();

        const data = await (await fetch(`https://www.reddit.com/r/${interaction.options.getString('subreddit')}/random/.json`)).json();

        if (!Array.isArray(data)) return interaction.editReply({ embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription('Subreddit doesn\'t exist.')] });

        const first = data[0].data.children[0].data;
        let url = '';

        if (first.url.includes('i.redd.it')) embed.setImage(`${first.url}`);
        else url = first.url;

        embed
            .setAuthor({ name: `${first.subreddit_name_prefixed} | ${first.created_utc.timeAgo()}` })
            .setTitle(first.title)
            .setDescription(`${first.selftext}\n${url}`)
            .setFooter({ text: `u/${first.author} | ${first.ups} Upvotes | ${first.num_comments} Comment(s)` })
            .setURL(`https://www.reddit.com${first.permalink}`)
            .setColor(client.embedColor);

        interaction.editReply({ embeds: [embed] });
    }
}
