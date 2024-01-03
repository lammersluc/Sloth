import { EmbedBuilder } from 'discord.js';

module.exports = {
    name: 'covid',
    description: 'Shows current COVID-19 data for a country.',
    category: 'info',
    options: [
        {
            name: 'country',
            type: 'string',
            required: true 
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);

        try {

            const response = await fetch(`https://disease.sh/v3/covid-19/countries/${interaction.options.getString('country')}`);
            const data = await response.json() as any;

            interaction.editReply({ embeds: [embed
                    .addFields(
                        {
                            name: 'Country',
                            value: data.country.toString()
                        },
                        {
                            name: 'Cases',
                            value: data.cases.toLocaleString()
                        },
                        {
                            name: 'Deaths',
                            value: data.deaths.toLocaleString()
                        },
                        {
                            name: 'Recovered',
                            value: data.recovered.toLocaleString()
                        },
                        {
                            name: 'Active',
                            value: data.active.toLocaleString()
                        },
                        {
                            name: 'Critical',
                            value: data.critical.toLocaleString()
                        },
                        {
                            name: 'Cases Today',
                            value: data.todayCases.toLocaleString()
                        },
                        {
                            name: 'Deaths Today',
                            value: data.todayDeaths.toLocaleString()
                        }
                    )
                    .setThumbnail(data.countryInfo.flag)
                ]});
            
        } catch(e) { interaction.editReply({ embeds: [embed.setDescription('Country doesn\'t exist.')] }); }
        
    }
}