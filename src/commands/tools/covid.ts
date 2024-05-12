import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('covid')
        .setDescription('Shows current COVID-19 data for a country.')
        .addStringOption(o => o
            .setName('country')
            .setDescription('The country for which you want to see COVID-19 data.')
            .setRequired(true)),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        try {
            const country = interaction.options.getString('country');
            const data = await (await fetch(`https://disease.sh/v3/covid-19/countries/${country}`)).json();

            interaction.editReply({
                embeds: [embed
                    .addFields(
                        { name: 'Country', value: data.country.toString() },
                        { name: 'Cases', value: data.cases.toLocaleString() },
                        { name: 'Deaths', value: data.deaths.toLocaleString() },
                        { name: 'Recovered', value: data.recovered.toLocaleString() },
                        { name: 'Active', value: data.active.toLocaleString() },
                        { name: 'Critical', value: data.critical.toLocaleString() },
                        { name: 'Cases Today', value: data.todayCases.toLocaleString() },
                        { name: 'Deaths Today', value: data.todayDeaths.toLocaleString() }
                    )
                    .setThumbnail(data.countryInfo.flag)
                ]
            });
        } catch (e) { interaction.editReply({ embeds: [embed.setDescription('Country doesn\'t exist.')] }); }
    }
}