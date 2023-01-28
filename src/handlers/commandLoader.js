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
            
        let commands = new SlashCommandBuilder()
            .setName(cmd.name)
            .setDescription(cmd.description)

        cmd.options.map(o => { commands.addStringOption(option => option.setName(o.name).setDescription('Sloth').setRequired(o.forced)); })

        return commands;
    
    });

    commandRegister(data);
    
}

module.exports = { commandLoader };