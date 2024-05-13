import type { Collection, SlashCommandBuilder } from "discord.js";

interface Track {
    name: string;
    artist: string;
    album: string;
    uri: string;
}

interface Playlist {
    name: string;
    public: boolean;
    tracks: Track[];
}

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
        categories: Collection<string, string[]>;
        devs: string[];
        embedColor: ColorResolvable;
        musicquiz: string[];
        playlist: Playlist
    }

    interface Command {
        data: SlashCommandBuilder;
        execute: (client: any, interaction: ChatInputCommandInteraction) => void;
    }
}