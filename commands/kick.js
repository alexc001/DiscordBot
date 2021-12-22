const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'basic kick command',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete(); 
        const {guild, member, mentions} = message
        const {name} = guild
        const icon = guild.iconURL({dynamic: true})


        if(!member.hasPermission('KICK_MEMBERS') || !member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, "Missing Permission to kick")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        const target = mentions.users.first();
        if(!target){
            options.errorEmbed(embed, "Please tag a user")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        let reason = args.slice(1).join(" ")
        if(!reason) reason = "None"

        let channel = message.guild.channels.cache.find(c=>c.name===config.logChannel)
        if(!channel){
            options.errorEmbed(embed, "Please check config.logchannel in YML File")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        const targetMember = message.guild.members.cache.get(target.id)
        if(targetMember.hasPermission('ADMINISTRATOR')){
            options.errorEmbed(embed, "Cant kick user... has admin perms")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
        targetMember.ban()
        const kickEmbed = new MessageEmbed()
        .setAuthor(`${name} Kicks`)
        .setThumbnail(target.displayAvatarURL({form: 'png', dynamic: true}))
        .setDescription(`User Kicked: <@${target.id}>\nKicked By: <@${message.author.id}>\nReason: `+ options.boldWrap(`${reason}`))
        .setFooter("Kick Date", icon).setColor(color).setTimestamp()
        

        message.channel.send(kickEmbed).then(msg=>{
            msg.delete({timeout: 5000})
        })
        channel.send(kickEmbed)
    }
}