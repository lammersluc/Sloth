import type { Collection, SlashCommandBuilder } from "discord.js";
import type spotify from "@external/spotify.json";

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
        playlist: spotify
    }

    interface Command {
        data: SlashCommandBuilder;
        execute: (client: any, interaction: ChatInputCommandInteraction) => void;
    }
}