import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

function clean(string: string): string {
    return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
}

export default {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Runs code.')
        .addStringOption(o => o
            .setName('input')
            .setDescription('The code to run.')
            .setRequired(true)),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor).setTitle('Code');
        const input = interaction.options.getString('input')!;
        let stdout = '';
        let stderr = '';
        
        const consoleLog = console.log;
        console.log = (message: any) => {
            stdout += message + '\n';
        };

        try {
            eval(`try{${input}}catch(e){throw new Error(e);}`);
        } catch (e: any) {
            stderr = e.stack.split('\n')[0];
        }
        
        console.log = consoleLog;

        embed.addFields({ name: 'Input', value: `\`\`\`js\n${input}\`\`\`` });
        if (stdout) embed.addFields({ name: 'Output', value: `\`\`\`js\n${stdout}\`\`\`` });
        if (stderr) embed.addFields({ name: 'Error', value: `\`\`\`js\n${clean(stderr)}\`\`\`` });

        interaction.editReply({ embeds: [embed] });
    }
}