const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'repeat',
  description: 'Switches the repeat mode',
  category: 'music',
  options: [],
  enabled: true,
  visible: true,
  devOnly: false,
  adminOnly: false,
  run: async (client, interaction) => {
    
    let embed = new EmbedBuilder().setColor(client.embedColor);
    if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
    const queue = client.distube.getQueue(interaction);

    if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing in the queue.')] });

    let mode;
    
    if (queue.repeatMode === 2) { queue.setRepeatMode(); mode = 'Off'; }
    else if (queue.repeatMode === 0) { queue.setRepeatMode(); mode = 'Repeat a song'; }
    else { queue.setRepeatMode(); mode = 'Repeat the queue'; }

    interaction.editReply({ embeds: [embed.setDescription(`Set repeat mode to \`${mode}\`.`)] });

  }
}