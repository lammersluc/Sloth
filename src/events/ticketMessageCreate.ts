import { Client } from "discord.js";

module.exports = async (client: Client, message: any) => {
    
    if (message.author.id === client.user?.id) return;
    
    const userid = message.channel.name.split('-').pop();
    const dm = client.users.cache.get(userid);

    dm?.send(message.content);

}