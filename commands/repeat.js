module.exports = {
    name: 'repeat',
    helpname: 'Repeat',
    aliases: ['loop' ,'rp'],
    aliasesText: 'Loop, RP',
    description: 'Switches the repeat mode',
    usage: 'Repeat',
    enabled: true,
    visible: true,
    devOnly: false,
    servAdmin: false,
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`There is nothing playing right now.`)
        let mode = null
        switch (args[0]) {
          case 'off':
            mode = 0
            break
          case 'song':
            mode = 1
            break
          case 'queue':
            mode = 2
            break
        }
        mode = queue.setRepeatMode(mode)
        mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
        message.channel.send(`Set repeat mode to \`${mode}\`.`)
    }
}