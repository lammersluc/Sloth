import { EmbedBuilder } from 'discord.js';
import { spawn } from 'child_process';

function clean(string: string) {
    return string
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
}

export default {
    name: 'dev',
    description: 'Runs dev commands.',
    category: 'dev',
    options: [
        {
            name: 'action',
            type: 'string',
            choices: [
                { name: 'Cmd', value: 'cmd' },
                { name: 'Code', value: 'code'}
            ],
            required: true
        },
        {
            name: 'input',
            type: 'string',
            required: true
        }
    ],
    enabled: true,
    devOnly: true,
    adminOnly: false,
    run: async (client: any, interaction: any) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let action = interaction.options.getString('action');
        let input = interaction.options.getString('input');

        if (action== 'cmd') {

            embed.setTitle('CMD');
            let stdout: string;
            let stderr: string;
            
            const cmd = spawn(input, { shell: true });

            cmd.stdout.on('data', (data: string) => stdout = data.toString() );
            cmd.stderr.on('data', (data: string) => stderr = data.toString() );

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

        } else if (action == 'code') {

            try {

                embed.setTitle('Code');

                let evaled = eval(input);

                if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                if (evaled == 'undefined') evaled = 'No output.';
                if (evaled.length > 1024) evaled = evaled.slice(0, 1021) + '...';

                embed.addFields(

                    { name: 'Input', value: `\`\`\`js\n${input}\`\`\`` },
                    { name: 'Output', value: `\`\`\`js\n${clean(evaled)}\`\`\`` }

                );

                interaction.editReply({ embeds: [embed] });

            } catch (e) { interaction.editReply({ embeds: [embed.setDescription(`An error occured: \`\`\`js\n${clean(e as string)}\`\`\``)] }); }

        }
    }
}