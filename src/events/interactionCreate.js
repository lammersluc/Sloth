const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = async (client, interaction) => {
    
    if (!interaction.isChatInputCommand()) return;

    let embed = new EmbedBuilder().setColor(client.embedColor);

    const command = interaction.commandName

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (cmd.devOnly && !client.devs.includes(message.author.id)) return interaction.reply({ embeds: [embed.setDescription('This command is only for developers.')] });
    if (cmd.adminOnly && !message.member.permissionsFor(message.member).has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [embed.setDescription(`Only server admins can use this command.`)] });

    await interaction.deferReply();
    try { cmd.run(client, interaction); } catch(e) { console.log(e); }

}