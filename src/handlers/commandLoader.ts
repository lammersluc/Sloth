import * as fs from 'fs';

import { commandRegister } from './commandRegister';
import { type Command } from 'discord.js';

async function commandLoader(client: any) {
    const folders = fs.readdirSync('./src/commands'); 
    
    for (const folder of folders) {
        const files = fs.readdirSync(`./src/commands/${folder}`);
        let commands = [];

        for (const file of files) {
            const command: Command = require(`../commands/${folder}/${file}`).default;
            client.commands.set(command.data.name, command);
            commands.push(command.data.name);
        }

        client.categories.set(folder, commands);
    }

    commandRegister(client.commands.map((cmd: Command) => cmd.data));
}

export { commandLoader };