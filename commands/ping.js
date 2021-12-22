const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'ping command',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        message.channel.send("Pinging...").then(m =>{
            var ping = m.createdTimestamp - message.createdTimestamp;
            var pingEmbed = new MessageEmbed()
            .setDescription(`<@${message.author.id}>\'s ping is ${ping} ms`)
            .setColor(color)
            m.edit(pingEmbed)
            m.delete({timeout: 4000})
            });
    }
}