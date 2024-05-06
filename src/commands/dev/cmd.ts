import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { spawn } from 'child_process';

export default {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Runs commands.')
        .addStringOption(opt => opt
            .setName('input')
            .setDescription('The command to run.')
            .setRequired(true)
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor).setTitle('CMD');
        const input = interaction.options.getString('input')!;

        let stdout = '';
        let stderr = '';

        const cmd = spawn(input, { shell: true });

        cmd.stdout.on('data', (data) => { stdout += data.toString(); });
        cmd.stderr.on('data', (data) => { stderr += data.toString(); });

        cmd.on('close', () => {
            if (!stdout) stdout = 'No output.';
            if (!stderr) stderr = 'No error.';

            embed.addFields(
                { name: 'Input', value: `\`\`\`${input}\`\`\`` },
                { name: 'Output', value: `\`\`\`${stdout}\`\`\`` },
                { name: 'Error', value: `\`\`\`${stderr}\`\`\`` }
            );

            interaction.editReply({ embeds: [embed] });
        });
    }
}