module.exports = {
    name: 'play',
    description: 'play music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        message.delete();
        if(!args[0]){
            options.errorEmbed(embed, 'Please mention a song name!')
            message.channel.send(embed)
            message.delete({timeout: 5000})
        }
        distube.play(message, args.join(" "));
    }
}
