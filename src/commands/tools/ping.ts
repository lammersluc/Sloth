import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping to test delay.'),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor);

        const msg = await interaction.editReply({ embeds: [embed.setDescription('Pinging...')] })
        
        interaction.editReply({ embeds: [embed
            .setTitle('Pong')
            .setDescription(`The response time is ${msg.createdTimestamp - interaction.createdTimestamp}ms.`)]
        });
    }
}