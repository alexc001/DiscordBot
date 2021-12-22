const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'unlink',
    description: 'unlink accounts from your discord',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb){
        message.delete();
        let userID = userdb.findUser(message.author.id)
        if(!userID){
            options.errorEmbed(embed, 'There is no account linked to your discord!')
            message.channel.send(embed).then(msg=>{msg.delete({timeout:4000})})
            return;
        } else {
            let userID = userdb.removeUser(message.author.id)
            options.successEmbed(embed, 'You have unlinked your account!!')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
        }
    }
}