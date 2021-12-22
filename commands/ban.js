const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "ban",
    description: "ban command",
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        const {guild, member, mentions} = message
        const {name} = guild
        const icon = guild.iconURL({dynamic: true})


        if(!member.hasPermission('BAN_MEMBERS') || !member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, "Missing Permission to ban")
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
            options.errorEmbed(embed, "Cant ban user... has admin perms")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
        targetMember.ban()
        const banEmbed = new MessageEmbed()
        .setAuthor(`${name} Bans`)
        .setThumbnail(target.displayAvatarURL({form: 'png', dynamic: true}))
        .setDescription(`User Banned: <@${target.id}>\nBanned By: <@${message.author.id}>\nReason: `+ options.boldWrap(`${reason}`))
        .setFooter("Ban Date", icon).setColor(color).setTimestamp()
        

        message.channel.send(banEmbed).then(msg=>{
            msg.delete({timeout: 5000})
        })
        channel.send(banEmbed)
    }
}