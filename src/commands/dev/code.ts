import { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

function clean(string: string): string {
    if (typeof string === "string") {
        return string.replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return string;
    }
}

export default {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Runs code.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The code to run.')
                .setRequired(true)),
    async execute(client: Client, interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(client.embedColor).setTitle('Code');
        const input = interaction.options.getString('input')!;

        try {
            let evaled = eval(input);

            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (evaled === 'undefined') evaled = 'No output.';
            if (evaled.length > 1024) evaled = evaled.slice(0, 1021) + '...';

            embed.addFields(
                { name: 'Input', value: `\`\`\`js\n${input}\`\`\`` },
                { name: 'Output', value: `\`\`\`js\n${clean(evaled)}\`\`\`` }
            );

            interaction.editReply({ embeds: [embed] });
        } catch (e: any) { interaction.editReply({ embeds: [embed.setDescription(`An error occurred: \`\`\`js\n${clean(e)}\`\`\``)] }); }
    }
}