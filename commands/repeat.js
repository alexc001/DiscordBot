module.exports = {
    name: 'repeat',
    description: 'repeat music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        distube.setRepeatMode(message, parseInt(args[0]));
    }
}