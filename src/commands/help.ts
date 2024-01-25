import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';

export default {
    name: 'help',
    description: 'Help command.',
    category: 'info',
    options: [],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let row = new ActionRowBuilder();
        let categories: string[] = [];

        client.commands.forEach((cmd: any) => { if(!categories.includes(cmd.category) && cmd.category !== 'dev') categories.push(cmd.category); });
        categories.forEach((category: any) => { row.addComponents(new ButtonBuilder().setStyle(1).setLabel(category.capitalize()).setCustomId(category)); });

        interaction.editReply({ embeds: [embed.setDescription('Choose a category to show help from.')], components: [row] }).then((msg: any) => {

            const filter = (button: any) => button.member.id == interaction.member.id;

            msg.awaitMessageComponent({ filter, time: 30000, errors: ['time'] }).then((button: any) => {

                let category = button.customId;

                client.commands.filter((cmd: any) => cmd.category == category).forEach((cmd: any) => { embed.addFields({ name: `**${cmd.name.capitalize()}**`, value: cmd.description, inline: true }); });

                interaction.editReply({ embeds: [embed.setTitle(category.capitalize()).setDescription(null)], components: [] });

            }).catch((e: any) => { interaction.editReply({ embeds: [embed.setDescription('You didn\'t choose anything after 30 seconds.')], components: [] }); });

        });
        
    }
}