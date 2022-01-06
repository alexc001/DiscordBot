module.exports = {
    name: 'skip',
    description: 'skip music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        message.delete();

        const {guild, member, mentions} = message
        const {name} = guild
        const icon = guild.iconURL({dynamic: true})


        if(member.roles.cache.find(r=>r.name === config.djRole) || member.hasPermission('ADMINISTRATOR')){
            distube.skip(message);
        } else {
            options.permissionEmbed(embed, "no permission to skip")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

    }
}
