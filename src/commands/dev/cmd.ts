import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { spawn } from 'child_process';

export default {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Runs commands.')
        .addStringOption(o => o
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

            embed.addFields({ name: 'Input', value: `\`\`\`sh\n${input}\`\`\`` });
            if (stdout) embed.addFields({ name: 'Output', value: `\`\`\`sh\n${stdout}\`\`\`` });
            if (stderr) embed.addFields({ name: 'Error', value: `\`\`\`sh\n${stderr}\`\`\`` });

            interaction.editReply({ embeds: [embed] });
        });
    }
}