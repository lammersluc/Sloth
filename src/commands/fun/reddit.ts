import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

function toRelativeTime(unixTimestamp: number) {
    const secondsAgo = Math.floor((Date.now() / 1000) - unixTimestamp);

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    if (secondsAgo < intervals.minute) return 'just now';
    if (secondsAgo < intervals.hour) return `${Math.floor(secondsAgo / intervals.minute)} min. ago`;
    if (secondsAgo < intervals.day) return `${Math.floor(secondsAgo / intervals.hour)} hr. ago`;
    if (secondsAgo < intervals.month) {
        const days = Math.floor(secondsAgo / intervals.day);
        return `${days} day${days === 1 ? '' : 's'} ago`
    }
    if (secondsAgo < intervals.year) return `${Math.floor(secondsAgo / intervals.month)} mo. ago`;
    return `${Math.floor(secondsAgo / intervals.year)} yr. ago`;
}

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
            .setAuthor({ name: `${first.subreddit_name_prefixed} | ${toRelativeTime(first.created_utc)}` })
            .setTitle(first.title)
            .setDescription(`${first.selftext}\n${url}`)
            .setFooter({ text: `u/${first.author} | ${first.ups} Upvotes | ${first.num_comments} Comment(s)` })
            .setURL(`https://www.reddit.com${first.permalink}`)
            .setColor(client.embedColor);

        interaction.editReply({ embeds: [embed] });
    }
}