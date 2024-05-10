import type { Collection, GuildMember, SlashCommandBuilder } from "discord.js";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
        categories: Collection<string, string[]>;
        devs: string[];
        embedColor: ColorResolvable;
        musicquiz: string[];
        volume: number;
    }

    interface Command {
        data: SlashCommandBuilder;
        execute: (client: any, interaction: ChatInputCommandInteraction) => void;
    }
}