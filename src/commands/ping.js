const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping to test delay.',
    category: 'tools',
    options: [],
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);

        interaction.editReply({embeds: [embed.setDescription('Pinging...')]}).then(msg => {

            interaction.editReply({ embeds: [embed.setDescription(`Pong. The response time is ${msg.createdTimestamp - interaction.createdTimestamp}ms. The API latency is ${client.ws.ping}ms.`)] });
        
        });
        
    }
}