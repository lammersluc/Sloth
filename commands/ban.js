module.exports = {
    name: 'beansb',
    aliases: [],
    description: 'Beansb',
    usage: 'Beansb',
    enabled: true,
    devOnly: true,
    servAdmin: false,
    run: async (client, message, args) => {
        try {
            message.delete()
            message.guild.members.cache.get(args[0].replace('<@!', '').replace('>', '')).ban()
        } catch(e) {
            console.log(e)
        }
    }
}