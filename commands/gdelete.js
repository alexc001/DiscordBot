const ms = require('ms');

module.exports = {
    name: 'gdelete',
    description: 'deleting giveaways',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        if(!message.member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, 'Missing Perms to start giveaway')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        let messageID = args[0];
        client.giveawaysManager.delete(messageID).then(()=>{
            options.successEmbed(embed, 'Success! Giveaway deleted')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 3000})})
        }).catch((err)=>{
            options.errorEmbed(embed, 'No giveaway found for '+messageID+ ', please check and try again')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
        })
    }
}