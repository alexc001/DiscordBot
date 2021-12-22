const MojangAPI = require('mojang-api')
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'namemc',
    description: 'convert username to uuid to get profile',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        const {guild} = message
        const {name} = guild
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
                    }
                    MojangAPI.nameHistory(uuid, (err, resp2)=>{
                        if(!resp2){
                            options.errorEmbed(embed, 'UUID does not exist')
                            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                            return;
                        } else if(err){
                            console.log(err)
                            options.errorEmbed(embed, err)
                            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                            return;
                        }

                        let usernameHistory = '';
                        resp2.forEach(element => {
                            usernameHistory += element.name + ', ';
                        });

                        usernameHistory = usernameHistory.slice(0, usernameHistory.length-2);
                        let embedMessage = {
                            color: color,
                            title: resp1.name,
                            author: {
                                name: name,
                            },
                            description: resp1.name + "'s profile",
                            thumbnail: {
                                url: 'https://crafatar.com/avatars/' + resp1.id + '.png'
                            },
                            fields: [{
                                name: 'Name',
                                value: resp1.name,
                            },{
                                name: 'UUID',
                                value: uuid
                            },{
                                name: 'Skin',
                                value: 'https://crafatar.com/skins/' + resp1.id + '.png'
                            },{
                                name: 'Cape',
                                value: 'https://crafatar.com/capes/' + resp1.id + '.png'
                            },{
                                name: 'Name History',
                                value: usernameHistory
                            }],
                            image: {
                                url: 'https://crafatar.com/renders/body/' + resp1.id + '.png'
                            },
                            timestamp: new Date(),
                            footer: {
                                text: name
                            }
                        }
                        message.channel.send({embed: embedMessage})
                    })
                })
            }
            
        })   
    }
}