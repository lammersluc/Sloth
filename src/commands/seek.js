const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const play = require('play-dl');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'seek',
    description: 'Seek to a specific time in the current song.',
    category: 'music',
    options: [
        {
            name: 'time',
            type: 'integer',
            required: true
        }
    ],
    enabled: true,
    devOnly: false,
    adminOnly: false,
    run: async (client, interaction) => {
        
        let embed = new EmbedBuilder().setColor(client.embedColor);
        const queue = client.queue.get(interaction.guildId);
        const time = interaction.options.getInteger('time');
        
        if (queue === undefined) return interaction.editReply({ embeds: [embed.setDescription('There is nothing playing right now')] });
        if (client.musicquiz.includes(interaction.guildId)) return interaction.editReply({ embeds: [embed.setDescription('I am currently playing a music quiz.')] });

        let song = queue.songs[0];

        if (time < 0) time = 0;
        else if (time > song.durationInSec) time = song.durationInSec;

        let stream = await play.stream(song.url, { seek: time });
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });

        getVoiceConnection(interaction.guild.id).state.subscription.player.play(resource);

        song.startedTime = time;

        interaction.editReply({ embeds: [embed.setDescription(`Seeked to \`${time}\` seconds.`)] });

    }
}