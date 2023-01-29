const { exec } = require('child_process');

module.exports = {
    name: 'restart',
    description: 'Restart the bot.',
    options: [],
    enabled: true,
    visible: false,
    devOnly: true,
    adminOnly: false,
    run: async (client, interaction) => {

        const embed = new client.EmbedBuilder().setColor(client.embedColor);

        interaction.editReply({ embeds: [embed.setDescription(`Restarting...`)] });
        client.user.setPresence({ activities: [{ name: `Restarting...` }], status: 'dnd' });
        exec('pm2 restart sloth');

    }
}