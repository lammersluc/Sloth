const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'covid',
    helpname: 'COVID',
    aliases: ['corona', 'covid-19', 'covid19'],
    aliasesText: 'Corona, Covid-19, Covid19',
    description: 'Shows current COVID-19 data for a country.',
    category: 'info',
    usage: 'Covid [Country]',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);

        if(!args[0]) return message.channel.send({ embeds: [embed.setDescription(`Please supply a country.`)] });

        try {

            let data = await axios.get(`https://disease.sh/v3/covid-19/countries/${args[0]}`);

            message.channel.send({ embeds: [embed
                    .addFields(
                        {
                            name: 'Country',
                            value: data.data.country.toString()
                        },
                        {
                            name: 'Cases',
                            value: data.data.cases.toString()
                        },
                        {
                            name: 'Deaths',
                            value: data.data.deaths.toString()
                        },
                        {
                            name: 'Recovered',
                            value: data.data.recovered.toString()
                        },
                        {
                            name: 'Active',
                            value: data.data.active.toString()
                        },
                        {
                            name: 'Critical',
                            value: data.data.critical.toString()
                        },
                        {
                            name: 'Cases Today',
                            value: data.data.todayCases.toString()
                        },
                        {
                            name: 'Deaths Today',
                            value: data.data.todayDeaths.toString()
                        }
                    )
                    .setThumbnail(data.data.countryInfo.flag)
                ]});
            
        } catch(e) { message.channel.send({ embeds: [embed.setDescription('Country doesn\'t exist.')] }); }
        
    }
}