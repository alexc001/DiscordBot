const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'blacklist',
    description: 'blacklist users from commands',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        const {guild, member, mentions} = message
        const {name} = guild
        const icon = guild.iconURL({dynamic: true})

        if(!message.member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, "Missing Permissions")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
         }

        let channel = message.guild.channels.cache.find(c=>c.name==config.logChannel)
        if(!channel){
            options.errorEmbed(embed, "Please Check config.logChannel in the YML File")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
    
         let user = message.mentions.users.first();
         if(!user){
            options.errorEmbed(embed, "Please tag a user")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
         }

         const targetMember = message.guild.members.cache.get(user.id)

         if(targetMember.hasPermission('ADMINISTRATOR')){
             options.errorEmbed(embed, "This user can't be blacklisted")
             message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
             return;
         }

         let userID = database.findBlacklist(user.id)
         if(!userID){
            let userID = database.addBlacklist(user.id)
            const blacklistEmbed = new MessageEmbed()
            .setAuthor(`${name} Blacklists`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setDescription(`User Blacklisted: <@${user.id}>\nBlacklisted By: <@${message.author.id}>\nDescription: `+ options.boldWrap(`<@${user.id}> can no longer use commands`))
            .setColor(color).setFooter("Time Sent", icon).setTimestamp()
            channel.send(blacklistEmbed);
            message.channel.send(blacklistEmbed).then(msg=>{msg.delete({timeout: 4000})})
             
         } else {
            options.errorEmbed(embed, "This user is already blacklisted")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
         }
    
    }
}