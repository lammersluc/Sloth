import type { Collection, GuildMember, SlashCommandBuilder } from "discord.js";
import type { Queue } from "play-dl";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
        categories: Collection<string, string[]>;
        devs: string[];
        embedColor: ColorResolvable;
        queue: Collection<string, Queue>;
        musicquiz: string[];
        volume: number;
    }

    interface Command {
        data: SlashCommandBuilder;
        execute: (client: any, interaction: ChatInputCommandInteraction) => void;
    }
}

declare module "play-dl" {
    interface YouTubeVideo {
        member: GuildMember;
        startedTime: number;
    }

    class Queue {
        songs: YouTubeVideo[];
        loop: boolean;
    }
}