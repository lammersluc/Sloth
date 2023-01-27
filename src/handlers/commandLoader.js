const { commandRegister } = require('./commandRegister');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

async function commandLoader(client) {

    fs.readdirSync('./src/commands').map(file => {

        const command = require(`../commands/${file}`);
    
        client.commands.set(command.name, command);
    
        for(let alias in command.aliases) { client.aliases.set(command.aliases[alias], command.name); }
    
      });

      const data = client.commands.map(command => {
            
            cmd = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description)

            command.options.map(o => { cmd.addStringOption(option => option.setName(o.name).setDescription('Sloth').setRequired(o.forced)); })

            return cmd;
    
        }
    );

    commandRegister(data);
    
}

module.exports = { commandLoader };