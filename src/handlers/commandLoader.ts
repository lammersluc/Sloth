import { Client, type Command } from 'discord.js';
import fs from 'fs';

import { commandRegister } from './commandRegister';

async function commandLoader(client: Client) {
    const folders = fs.readdirSync('./src/commands'); 
    
    for (const folder of folders) {
        const files = fs.readdirSync(`./src/commands/${folder}`);
        let commands = [];

        for (const file of files) {
            const command: Command = require(`@../commands/${folder}/${file}`).default;
            client.commands.set(command.data.name, command);
            commands.push(command.data.name);
        }

        client.categories.set(folder, commands);
    }

    commandRegister(client.commands.map((cmd: Command) => cmd.data));
}

export { commandLoader };