const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'clear',
    description: 'clear command',
    async execute(client, message, args, color, options, embed, database, config, chalk){


        if(!message.member.hasPermission('MANAGE_MESSAGES')){
            options.permissionEmbed(embed, "Missing permission to bulk delete")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        let deleteAmount;

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            options.errorEmbed(embed, "Enter amount to clear")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
    
        if (parseInt(args[0]) > 100) {
            options.errorEmbed(embed, "You can only clear up to 100 messages")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        } else {
            deleteAmount = parseInt(args[0]);
        }
        
        let channel = message.guild.channels.cache.find(c=>c.name===config.logChannel)
        if(!channel){
            options.errorEmbed(embed, "Please check config.logChannel in YML file")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        const clearEmbed = new MessageEmbed()
        .setAuthor('🗑️ Clear Messages')
        .setDescription(options.boldWrap(`<@${message.author.id}> has cleared ${deleteAmount} messages in <#${message.channel.id}>`))
        .setColor(color)
        message.channel.bulkDelete(deleteAmount + 1, true)
        channel.send(clearEmbed);
        message.channel.send(clearEmbed).then(msg=>{msg.delete({timeout: 4000})})
    
    }
}