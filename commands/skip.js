module.exports = {
    name: 'skip',
    description: 'skip music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        distube.skip(message);
    }
}