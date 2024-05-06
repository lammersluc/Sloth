import { ChatInputCommandInteraction } from "discord.js";

import { type Command } from "../utils";

export default async (client: any, interaction: ChatInputCommandInteraction) => {
    
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName) as Command;

    await interaction.deferReply();

    try { cmd.execute(client, interaction); } catch(e) { console.error(e); }
}