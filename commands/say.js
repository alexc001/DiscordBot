const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'say',
    description: 'say command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb){
        message.delete();
        const {guild} = message
        const {name} = guild
        if(!message.member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, 'Missing Permissions')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }



        let channel = message.mentions.channels.first();
        if(!channel){
            options.errorEmbed(embed, 'Need to mention channel to send msg to!')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        let announcement = args.slice(1).join(" ")
        if(!announcement){
            options.errorEmbed(embed, 'Please have a msg to make an announcement')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        const sayEmbed = new MessageEmbed()
        .setTitle('🔷 __**'+`${name}`+' Announcements**__ 🔷')
        .setDescription(announcement)
        .setFooter(`Sent By ${message.author.username}`, `${message.author.displayAvatarURL({dynamic: true})}`)
        .setTimestamp()
        .setColor(color)

        message.channel.send(sayEmbed).then(msg=>{msg.delete({timeout: 100000})})
        const sentEmbed = new MessageEmbed()
        .setDescription(options.singleWrap('Please Select the Following Options:\nOption 1: Sends Embed with @everyone\nOption 2: Sends embed without @everyone\nOption 3: Cancels Process'))
        .setColor(color)
        .setFooter("Time Sent",picc)
        .setTimestamp()
        message.channel.send(sentEmbed).then(msg=>{msg.delete({timeout: 100000})})

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {
            time: 20000
        })

        collector.on('collect', m=>{
            if(m.content.includes('1')){
                collector.stop('1')
                return;
            } else if(m.content.includes('2')){
                collector.stop('2')
                return;
            } if (m.content.includes(3)){
                collector.stop('3')
            }
        });

        collector.on('end', (collected, reason)=>{
            if(reason === '1'){
                options.successEmbed(embed, "You've finished the process!")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                channel.send(sayEmbed) && channel.send('@everyone')
            } else if(reason=== '2'){
                options.successEmbed(embed, "You've finished the process!")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                channel.send(sayEmbed)
            } else if(reason === '3'){
                options.cancelEmbed(embed, "You've cancelled the process!")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            } else {
                options.cancelEmbed(embed, "Cancelled due to no response in the last 20 seconds")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            }
        })
    }
}