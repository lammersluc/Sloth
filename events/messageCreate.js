const { MessageEmbed } = require("discord.js")

module.exports = async (client, message) => {
    if (!message.content.startsWith(client.prefix)) return
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return

    let embed = new MessageEmbed().setColor(client.embedColor)

    const args = message.content.slice(client.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return message.channel.send({ embeds: [embed.setDescription(`Command not found, try \`${client.prefix}Help\`.`)] })

    if (!cmd.enabled) return message.channel.send({ embeds: [embed.setDescription(`Command not found, try \`${client.prefix}Help\`.`)] })

    if (cmd.devOnly && !client.devs.includes(message.author.id)) {
        if (cmd.visible) {
            return message.channel.send({ embeds: [embed.setDescription('This command is only for developers.')] })
        } else {
            return message.channel.send({ embeds: [embed.setDescription(`Command not found, try \`${client.prefix}Help\`.`)] })
        }
    }

    try {
        cmd.run(client, message, args)
    } catch(e) {
        console.log(e)
    }
}