import { REST, Routes, SlashCommandBuilder } from 'discord.js';

async function commandRegister(data: SlashCommandBuilder[]): Promise<void> {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
    
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: data });
}

export { commandRegister };