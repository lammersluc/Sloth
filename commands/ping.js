module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Ping to test delay.',
    usage: 'Ping',
    enabled: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        message.channel.send('Pinging...').then(msg => {
            msg.edit(`Pong. The response time is ${msg.createdTimestamp - message.createdTimestamp}ms. The API latency is ${Math.round(client.ws.ping)}ms.`)
        })
    }
}