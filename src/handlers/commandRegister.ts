import { REST, Routes } from 'discord.js';

async function commandRegister(data: any) {

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN || '');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID || ''), { body: data });

}

export { commandRegister };