import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping to test delay.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        interaction.editReply({ embeds: [embed.setDescription('Pinging...')] }).then(msg => {
            interaction.editReply({ embeds: [embed.setDescription(`Pong. The response time is ${msg.createdTimestamp - interaction.createdTimestamp}ms. The API latency is ${client.ws.ping}ms.`)] });
        });
    }
}