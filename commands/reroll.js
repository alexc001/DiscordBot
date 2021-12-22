const ms = require('ms');

module.exports = {
    name: 'reroll',
    description: 'reroll command for giveaways',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        if(!message.member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, 'Missing Perms to start giveaway')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return 
        }
        if(!args[0]){
            options.errorEmbed(embed, 'You have to specify a valid message ID!')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        let giveaway = 

        client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
        client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if(!giveaway){
            options.errorEmbed(embed, 'Unable to find a giveaway for `'+ args.join(' ') +'`.')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        client.giveawaysManager.reroll(giveaway.messageID)
        .then(() => {
        // Success message
        message.channel.send('Giveaway rerolled!');
    }).catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('This giveaway is not ended!');
        } else {
            console.error(e);
            message.channel.send('An error occured...');
        }
    });
    }
}