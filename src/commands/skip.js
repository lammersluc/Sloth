const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  aliases: ['next'],
  description: 'Skips to the next song.',
  category: 'music',
  options: [],
  enabled: true,
  visible: true,
  devOnly: false,
  adminOnly: false,
  run: async (client, interaction) => {
    
    let embed = new EmbedBuilder().setColor(client.embedColor);
    const queue = client.distube.getQueue(interaction);

    if (!queue) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now')] });
    if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });
    if (!queue.songs[1]) { client.distube.voices.leave(interaction); return interaction.editReply({ embeds: [embed.setDescription('There is nothing in the queue to skip to. So the bot has left the voice channel.')] }); }

    await queue.skip();

    interaction.editReply({ embeds: [embed.setDescription('Skipped.')] });

}
}