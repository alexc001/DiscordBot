module.exports = {
    name: 'stop',
    description: 'stop music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        message.delete();

        const {guild, member, mentions} = message
        const {name} = guild
        const icon = guild.iconURL({dynamic: true})


        if(member.roles.cache.find(r=>r.name === config.djRole) || member.hasPermission('ADMINISTRATOR')){
            distube.stop(message)
            message.channel.send("Stopped the music!").then(msg=>{msg.delete({timeout: 5000})})
        } else {
            options.permissionEmbed(embed, "no permission to stop the music")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }



        
    }
}
