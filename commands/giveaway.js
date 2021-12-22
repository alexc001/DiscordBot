const ms = require('ms');

module.exports = {
    name: 'giveaway',
    description: 'giveaway command',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        if(!message.member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, 'Missing Perms to start giveaway')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
    

        let giveawayChannel = message.mentions.channels.first();
     
        if(!giveawayChannel){
            options.errorEmbed(embed, 'You have to mention a valid channel')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return
        }
    
    
        let giveawayDuration = args[1];
      
        if(!giveawayDuration || isNaN(ms(giveawayDuration))){
            options.errorEmbed(embed, 'You have to specify a valid duration')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return
        }
    
  
        let giveawayNumberWinners = args[2];

        if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
            options.errorEmbed(embed, 'You have to specify a valid amount of winners')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return
        }
    
        let giveawayPrize = args.slice(3).join(' ');
  
        if(!giveawayPrize){
            options.errorEmbed(embed, 'You have to specify a valid prize')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return
        }
    
        client.giveawaysManager.start(giveawayChannel, {
            time: ms(giveawayDuration),
            prize: giveawayPrize,
            winnerCount: giveawayNumberWinners,
            hostedBy: message.author,
            messages: {
                timeRemaining: "Time remaining: **{duration}**!",
                inviteToParticipate: "React with 🎉 to participate!",
                winMessage: "Congratulations, {winners}! You won **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: "Giveaway cancelled, no valid participations.",
                winners: "winner(s)",
                endedAt: "Ended at",
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: "hours",
                    days: "days",
                    pluralS: false 
                }
            }
        });
    
        message.channel.send(`Giveaway started in ${giveawayChannel}!`).then(msg=>{msg.delete({timeout: 4000})})
    
    }

}