import { PermissionsBitField, EmbedBuilder, BaseClient } from "discord.js";

module.exports = async (client: any, interaction: any) => {
    
    if (!interaction.isChatInputCommand()) return;

    let embed = new EmbedBuilder().setColor(client.embedColor);

    const command = interaction.commandName

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (cmd.devOnly && !client.devs.includes(interaction.user.id)) return interaction.reply({ embeds: [embed.setDescription('This command is only for developers.')] });
    if (cmd.adminOnly && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [embed.setDescription(`Only server administrators can use this command.`)] });

    await interaction.deferReply();
    try { cmd.run(client, interaction); } catch(e) { console.log(e); }

}