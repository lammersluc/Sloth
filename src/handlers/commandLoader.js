const { commandRegister } = require('./commandRegister');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

async function commandLoader(client) {

    fs.readdirSync('./src/commands').map(file => {

        const command = require(`../commands/${file}`);
    
        client.commands.set(command.name, command);
    
        for(let alias in command.aliases) { client.aliases.set(command.aliases[alias], command.name); }
    
    });

    const data = client.commands.map(cmd => {

        if (!cmd.enabled) return;
            
        let commands = new SlashCommandBuilder()
            .setName(cmd.name)
            .setDescription('Sloth')

        cmd.options.map(o => { 
            
            if (o.type === 'string') {
                
                commands.addStringOption(option => { option
                
                        .setName(o.name)
                        .setDescription('Sloth')
                        
                    if (o.required) option.setRequired(o.required);
                    if (o.minLength) option.setMinLength(o.minLength);
                    if (o.maxLength) option.setMaxLength(o.maxLength);
                    if (o.choices) option.addChoices(...o.choices);

                    return option;

                }

            )} else if (o.type === 'integer') { 

                commands.addIntegerOption(option => { option

                        .setName(o.name)
                        .setDescription('Sloth')

                    if (o.required) option.setRequired(o.required);
                    if (o.minValue) option.setMinValue(o.minValue);
                    if (o.maxValue) option.setMaxValue(o.maxValue);
                    if (o.choices) option.addChoices(...o.choices);

                    return option;

                }
                
            )} else if (o.type === 'user') { 

                commands.addUserOption(option => { option

                        .setName(o.name)
                        .setDescription('Sloth')

                    if (o.required) option.setRequired(o.required);

                    return option;

                }
                
            )} else if (o.type === 'boolean') {
                
                commands.addBooleanOption(option => { option
                
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