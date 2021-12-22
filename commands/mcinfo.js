const {MessageEmbed} = require('discord.js');
const util = require('minecraft-server-util');
const image = "https://cdn.discordapp.com/attachments/871055654549327885/874893728211402852/Screen-Shot-2020-05-23-at-11.png"
module.exports = {
    name: 'mcinfo',
    description: 'info command for discord and ingame',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        let serverIP = args[0];
        if(!serverIP){ options.errorEmbed(embed, 'Please enter a valid minecraft server')
        message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
        return;}
        util.status(serverIP).then((response)=>{
            const serverEmbed = new MessageEmbed()
            .setAuthor(`${args[0]} Stats`)
            .setImage(image)
            .setDescription(options.boldWrap(options.underlineWrap('Current Ingame Stats\n'))+ `Server IP: **${response.host}**\nServer Version: **${response.version}**\nCurrent Online Players: **${response.onlinePlayers}**`)
            .setColor(color)
            message.channel.send(serverEmbed).then(msg=>{msg.delete({timeout: 120000})})
        }).catch((error)=>{
            console.error(error)
            options.errorEmbed(embed, "Provide a MINECRAFT IP that exists!")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 40000})})
        }) 
        
    }
}