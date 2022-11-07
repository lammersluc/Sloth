const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invite',
    helpname: 'Invite',
    aliases: [],
    aliasesText: ' ',
    description: 'Creates or shows invite for the server.',
    usage: 'Invite',
    enabled: true,
    visible: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, message, args) => {
        let embed = new EmbedBuilder().setColor(client.embedColor);
        try {
            const invites = await message.guild.invites.fetch();

            invites.forEach(invite => {
                if (invite.inviter === client.user.id) {
                    return message.channel.send({ embeds: [embed.setDescription(`Invite: ${invite.url}`)] });
                }
            })
            
            message.guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT').createInvite({
                maxAge: 0,
                maxUses: 0
            }).then(invite => {
                message.channel.send({ embeds: [embed.setDescription(`Invite: ${invite.url}`)] });
            });
        } catch (e) { message.channel.send({ embeds: [embed.setDescription(`I do not have the permission to manage server invites.`)] }); }
    }
}