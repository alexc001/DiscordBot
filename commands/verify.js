const {MessageEmbed, MessageAttachment} = require('discord.js');
module.exports = {
    name: 'verify',
    description: 'verify command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
     message.delete();
     const {guild} = message;
        const verificationEmbed = new MessageEmbed()
        .setTitle('Verification')
        .setDescription('Please React to Recieve Access')
        .setColor(color)
        let channel = guild.channels.cache.find(c=>c.name=== config.verifyChannel)
        if(!channel) {
            options.errorEmbed(embed, "Please create channel named verify")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
        if(!config.verifyEmoji){
            console.log(chalk.redBright('NO Emoji Found!!!'))
            return;
        }
        channel.send(verificationEmbed).then(msgEmbed =>{
            msgEmbed.react(config.verifyEmoji)
        })





    }
}