import { Client, ActivityType, type PresenceData } from 'discord.js';

const getPresence = (client: Client): PresenceData => ({ activities: [{ name: `/Help | ${client.guilds.cache.size} Guilds`, type: ActivityType.Listening }] });

export {
    getPresence
}