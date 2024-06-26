import { BaseInteraction, Client } from "discord.js";

export default async (client: Client, interaction: BaseInteraction) => {
    
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);

    if (!cmd) return;

    if (client.categories.get('hidden')?.includes(cmd.data.name)) {

        await interaction.deferReply({ ephemeral: true });
        
        if (!client.devs.includes(interaction.user.id)) return interaction.editReply('You do not have permission to use this command.');
        
    } else await interaction.deferReply();

    cmd.execute(client, interaction);
}