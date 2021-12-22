module.exports = {
    name: 'play',
    description: 'play music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        distube.play(message, args.join(" "));
    }
}