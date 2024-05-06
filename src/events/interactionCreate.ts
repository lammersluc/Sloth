import { BaseInteraction, Client } from "discord.js";

export default async (client: Client, interaction: BaseInteraction) => {
    
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);

    if (!cmd) return;

    await interaction.deferReply();

    try { cmd.execute(client, interaction); } catch(e) { console.error(e); }
}