const { REST, Routes } = require('discord.js')

async function commandRegister(data) {

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: data });

}

module.exports = { commandRegister };