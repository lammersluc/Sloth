import type { SlashCommandBuilder } from "discord.js";
import type { YouTubeVideo } from "play-dl";

type Command = {
    data: SlashCommandBuilder;
    execute: (client: any, interaction: any) => void;
};

type Queue = {
    songs: YouTubeVideo[];
    loop: boolean;
};

export {
    type Command,
    type Queue
};