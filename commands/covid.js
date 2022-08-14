const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'covid',
    helpname: 'COVID',
    aliases: ['corona', 'covid-19', 'covid19'],
    aliasesText: 'Corona, Covid-19, Covid19',
    description: 'Shows current COVID-19 data for a country.',
    usage: 'Covid [Country]',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor)
        if(!args[0]) {
            return message.channel.send({ embeds: [embed.setDescription(`Please supply a country.`)] })
        }

        try {
            let data = await axios.get(`https://disease.sh/v3/covid-19/countries/${args[0]}`)

            message.channel.send({
                embeds: [embed
                    .addField('Cases', `**Total Cases**: ${data.data.cases.toLocaleString()}\n**Today Cases**: ${data.data.todayCases.toLocaleString()}\n**Total Cases Per One Million**: ${data.data.casesPerOneMillion.toLocaleString()}`)
                    .addField('Critical', `**Current Critical**: ${data.data.critical.toLocaleString()}\n**Critical Per One Million**: ${data.data.criticalPerOneMillion.toLocaleString()}`)
                    .addField('Deaths', `**Total Deaths**: ${data.data.deaths.toLocaleString()}\n**Today Deaths**: ${data.data.todayDeaths.toLocaleString()}\n**Total Deaths Per One Million**: ${data.data.deathsPerOneMillion.toLocaleString()}`)
                    .addField('Recovered', `**Total Recovered**: ${data.data.recovered.toLocaleString()}\n**Today Recovered**: ${data.data.todayRecovered.toLocaleString()}\n**Total Recovered Per One Million**: ${data.data.recoveredPerOneMillion.toLocaleString()}`)
                    .addField(`Information about ${data.data.country}`, `**Population**: ${data.data.population.toLocaleString()}\n**Lat**: ${data.data.countryInfo.lat.toLocaleString()}\n**Long**: ${data.data.countryInfo.long.toLocaleString()}\n**ISO2**: ${data.data.countryInfo.iso2.toLocaleString()}\n**ISO3**: ${data.data.countryInfo.iso3.toLocaleString()}`)
                    .setImage(`${data.data.countryInfo.flag.toLocaleString()}`)
                ]})
        } catch(e) {
            message.channel.send({ embeds: [embed.setDescription('Country doesn\'t exist.')] })
        }
    }
}