import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { spawn } from 'child_process';

export default {
    data: new SlashCommandBuilder()
        .setName('dev')
        .setDescription('Runs dev commands')
        .addSubcommand(s => s
            .setName('cmd')
            .setDescription('Runs a command')
            .addStringOption(o => o
                .setName('input')
                .setDescription('Command to run')
                .setRequired(true)
            )
        )
        .addSubcommand(s => s
            .setName('eval')
            .setDescription('Evaluates code')
            .addStringOption(o => o
                .setName('input')
                .setDescription('Code to evaluate.')
                .setRequired(true)
            )
        ),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'cmd':
                return cmdCmd(client, interaction);
            case 'eval':
                return evalCmd(client, interaction);
        }
    }
}

async function cmdCmd(client: Client, interaction: ChatInputCommandInteraction) {
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

function clean(string: string): string {
    return string.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
}

async function evalCmd(client: Client, interaction: ChatInputCommandInteraction) {
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