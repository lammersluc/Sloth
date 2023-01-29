const { EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    name: 'restart',
    description: 'Restart the bot.',
    category: 'dev',
    options: [],
    enabled: true,
    devOnly: true,
    adminOnly: false,
    run: async (client, interaction) => {

        const embed = new EmbedBuilder().setColor(client.embedColor);

        interaction.editReply({ embeds: [embed.setDescription(`Restarting...`)] });
        client.user.setPresence({ activities: [{ name: `Restarting...` }], status: 'idle' });

        exec('pm2 restart sloth');

    }
}