const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'covid',
    description: 'Shows current COVID-19 data for a country.',
    category: 'info',
    options: [{ name: 'country', forced: true }],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);

        try {

            let data = await axios.get(`https://disease.sh/v3/covid-19/countries/${interaction.options.getString('country')}`);

            interaction.editReply({ embeds: [embed
                    .addFields(
                        {
                            name: 'Country',
                            value: data.data.country.toString()
                        },
                        {
                            name: 'Cases',
                            value: data.data.cases.toLocaleString()
                        },
                        {
                            name: 'Deaths',
                            value: data.data.deaths.toLocaleString()
                        },
                        {
                            name: 'Recovered',
                            value: data.data.recovered.toLocaleString()
                        },
                        {
                            name: 'Active',
                            value: data.data.active.toLocaleString()
                        },
                        {
                            name: 'Critical',
                            value: data.data.critical.toLocaleString()
                        },
                        {
                            name: 'Cases Today',
                            value: data.data.todayCases.toLocaleString()
                        },
                        {
                            name: 'Deaths Today',
                            value: data.data.todayDeaths.toLocaleString()
                        }
                    )
                    .setThumbnail(data.data.countryInfo.flag)
                ]});
            
        } catch(e) { interaction.editReply({ embeds: [embed.setDescription('Country doesn\'t exist.')] }); }
        
    }
}