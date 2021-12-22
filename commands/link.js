const {MessageEmbed} = require('discord.js');
const MojangAPI = require('mojang-api')
module.exports = {
    name: 'link',
    description: 'linking minecraft profile',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb){
        message.delete();
        let username = args[0];
        if(!username){
            options.errorEmbed(embed, 'Please enter a valid username')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
        MojangAPI.nameToUuid(username, (err, resp)=>{
            if(!resp[0]){
                options.errorEmbed(embed, 'Username does not exist')
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                return;
            } else if (err){
                console.log(err)
                options.errorEmbed(embed, err)
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                return;
            } else {
                let uuid = resp[0].id;
                MojangAPI.profile(uuid, (err, resp1)=>{
                    if(!resp1){
                        options.errorEmbed(embed, 'UUID does not exist')
                        message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                        return;
                    } else if(err){
                        console.log(err)
                        options.errorEmbed(embed, err)
                        message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                        return;
                    } else {
                        let userID = userdb.findUser(message.author.id)
                        if(!userID){
                        let userID = userdb.addUser(message.author.id, resp1.name, resp1.id)
                        options.successEmbed(embed, `User has successfully linked ${resp1.name} to <@${message.author.id}>`)
                        message.channel.send(embed).then(msg=>{msg.delete({timeout: 40000})})
                        return;
                        } else {
                            options.errorEmbed(embed, 'User has already link a username! Please remove the link username')
                            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                            return;
                    } 
                }

                })
               
             }

            })
    }
}