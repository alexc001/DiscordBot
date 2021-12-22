module.exports = {
    name: 'queue',
    description: 'queue music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));

       
    }
}