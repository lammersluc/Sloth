const { EmbedBuilder } = require("discord.js");

module.exports = async (client, channel) => {
    
    let embed = new EmbedBuilder().setColor(client.embedColor);
    const userid = channel.name.split('-').pop();
    const dm = client.users.cache.get(userid);

    dm.send({ embeds: [embed.setDescription(`Your ticket has been closed. Feel free to dm me again to open a new one.`)] });
    
}