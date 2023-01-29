const { EmbedBuilder } = require('discord.js');
const { spawn } = require('child_process');
const { sleep } = require('../utils');

module.exports = {
    name: 'dev',
    description: 'Runs dev commands.',
    category: 'dev',
    options: [{ name: 'action', type: 'string', choices: [{ name: 'CMD', value: 'cmd' }, { name: 'Code', value: 'code'}, { name: 'Restart', value: 'restart'}], required: true }, { name: 'input', type: 'string' }],
    enabled: true,
    devOnly: true,
    adminOnly: false,
    run: async (client, interaction) => {

        let embed = new EmbedBuilder().setColor(client.embedColor);
        let action = interaction.options.getString('action');
        let input = interaction.options.getString('input');

        if (action=== 'cmd') {

            if (!input) return interaction.editReply({ embeds: [embed.setDescription(`Please provide a command to run.`)] });

            embed.setTitle('CMD');
            let stdout;
            let stderr;
            
            const cmd = spawn(input, { shell: true });

            cmd.stdout.on('data', (data) => { stdout = data.toString(); });
            cmd.stderr.on('data', (data) => { stderr = data.toString(); });

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

        } else if (action === 'code') {

            if (!input) return interaction.editReply({ embeds: [embed.setDescription(`Please provide a command to run.`)] });

            embed.setTitle('CMD');
            let stdout;
            let stderr;
            let closed = false;
            
            const cmd = spawn(`node -e '${input}'`, { shell: true });

            cmd.stdout.on('data', (data) => { stdout = data.toString(); });
            cmd.stderr.on('data', (data) => { stderr = data.toString(); });

            await sleep(3000);

            if (!closed) cmd.kill('SIGINT');


            cmd.on('close', () => {

                closed = true;

                if (!stdout) stdout = 'No output.';
                if (!stderr) stderr = 'No error.';

                embed.addFields(
    
                    { name: 'Input', value: `\`\`\`${input}\`\`\`` },
                    { name: 'Output', value: `\`\`\`${stdout}\`\`\`` },
                    { name: 'Error', value: `\`\`\`${stderr}\`\`\`` }
    
                );
    
                interaction.editReply({ embeds: [embed] });

            });

        } else if (action === 'restart') {

            interaction.editReply({ embeds: [embed.setDescription(`Restarting...`)] });
            client.user.setPresence({ activities: [{ name: `Restarting...` }], status: 'dnd' });
    
            spawn('pm2 restart sloth', { shell: true });

        }
    }
}