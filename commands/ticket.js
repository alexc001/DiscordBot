const {MessageEmbed, MessageAttachment} = require('discord.js');
module.exports = {
    name: 'ticket',
    description: 'ticket setup command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        message.delete();
     const {guild} = message;        
     const {name} = guild;
        const icon = guild.iconURL({dynamic: true});
        let channel1 = message.guild.channels.cache.find(c=>c.name=== config.ticketChannel)

        const ticketEmbed = new MessageEmbed()
        .setTitle(options.underlineWrap(`${name} Support`))
        .setDescription('Please **react** with a ❓ to create a ticket!\nAny bugs with your ticket DM **ADMINS**')
        .setFooter("Time Sent", icon)
        .setColor(color)
        .setTimestamp()

        channel1.send(ticketEmbed).then(async msgEmbed=>{
            await msgEmbed.react(config.ticketEmoji)
        })


    }
}