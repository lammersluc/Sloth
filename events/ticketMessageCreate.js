module.exports = async (client, message) => {
    if (message.author.id === client.user.id) return;
    const userid = message.channel.name.split('-').pop();
    const dm = client.users.cache.get(userid);
    dm.send(message.content);
}