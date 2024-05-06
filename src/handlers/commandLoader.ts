import * as fs from 'fs';

import { commandRegister } from './commandRegister';
import { type Command } from '../utils';

async function commandLoader(client: any) {
    const folders = fs.readdirSync('./src/commands');
    
    for (const category of folders) {
        const files = fs.readdirSync(`./src/commands/${category}`);
        let commands = [];

        for (const file of files) {
            const command: Command = require(`../commands/${category}/${file}`).default;
            client.commands.set(command.data.name, command);
            commands.push(command.data.name);
        }

        client.categories.set(category, commands);
    }

    commandRegister(client.commands.map((cmd: Command) => cmd.data));
}

export { commandLoader };