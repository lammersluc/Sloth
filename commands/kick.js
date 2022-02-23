module.exports = {
    name: 'beansk',
    aliases: [],
    description: 'Beansk',
    usage: 'Beansk',
    enabled: true,
    devOnly: true,
    servAdmin: false,
    run: async (client, message, args) => {
        try {
            message.delete()
            message.guild.members.cache.get(args[0].replace('<@!', '').replace('>', '')).kick()
        } catch(e) {
            console.log(e)
        }
    }
}