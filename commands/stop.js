module.exports = {
    name: 'stop',
    description: 'stop music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        distube.stop(message);
        message.channel.send("Stopped the music!");
    }
}