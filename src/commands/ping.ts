import { EmbedBuilder } from 'discord.js';

module.exports = {
    name: 'ping',
    description: 'Ping to test delay.',
    category: 'tools',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);

        interaction.editReply({embeds: [embed.setDescription('Pinging...')]}).then((msg: any) => {

            interaction.editReply({ embeds: [embed.setDescription(`Pong. The response time is ${msg.createdTimestamp - interaction.createdTimestamp}ms. The API latency is ${client.ws.ping}ms.`)] });
        
        });
        
    }
}