const { commandRegister } = require('./commandRegister');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

async function commandLoader(client: any) {

    fs.readdirSync('./src/commands').map((file: any) => {

        const command = require(`../commands/${file}`);
    
        client.commands.set(command.name, command);
    
        for(let alias in command.aliases) { client.aliases.set(command.aliases[alias], command.name); }
    
    });

    const data = client.commands.map((cmd: any) => {

        if (!cmd.enabled) return;
            
        let commands = new SlashCommandBuilder()
            .setName(cmd.name)
            .setDescription('Sloth')

        cmd.options.map((o: any) => { 
            
            if (o.type === 'string') {
                
                commands.addStringOption((option: any) => { option
                
                        .setName(o.name)
                        .setDescription('Sloth')
                        
                    if (o.required) option.setRequired(o.required);
                    if (o.minLength) option.setMinLength(o.minLength);
                    if (o.maxLength) option.setMaxLength(o.maxLength);
                    if (o.choices) option.addChoices(...o.choices);

                    return option;

                }

            )} else if (o.type === 'integer') { 

                commands.addIntegerOption((option: any) => { option

                        .setName(o.name)
                        .setDescription('Sloth')

                    if (o.required) option.setRequired(o.required);
                    if (o.minValue) option.setMinValue(o.minValue);
                    if (o.maxValue) option.setMaxValue(o.maxValue);
                    if (o.choices) option.addChoices(...o.choices);

                    return option;

                }
                
            )} else if (o.type === 'user') { 

                commands.addUserOption((option: any) => { option

                        .setName(o.name)
                        .setDescription('Sloth')

                    if (o.required) option.setRequired(o.required);

                    return option;

                }
                
            )} else if (o.type === 'boolean') {
                
                commands.addBooleanOption((option: any) => { option
                
                        .setName(o.name)
                        .setDescription('Sloth')
                        
                    if (o.required) option.setRequired(o.required);

                    return option;

                }

            )}

        });

        return commands;
    
    });

    commandRegister(data);
    
}

module.exports = { commandLoader };