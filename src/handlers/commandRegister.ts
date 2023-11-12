const { REST, Routes } = require('discord.js');

async function commandRegister(data: any) {

    const rest = new REST({ version: "10" }).setToken(Bun.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands(Bun.env.CLIENT_ID), { body: data });

}

module.exports = { commandRegister };