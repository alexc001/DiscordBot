const {MessageEmbed} = require('discord.js')
module.exports = {
    name: 'queue',
    description: 'queue music command',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube){
        let queue = distube.getQueue(message)
        if(!queue){
            options.errorEmbed(embed, "There is no queue")
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 5000})})
            return
        }
        const queueEmbed = new MessageEmbed()
        .setDescription('Current queue:\n' + queue.songs.map((song, id) =>`**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 10).join("\n"))
        .setColor(color)
        .setFooter("Music", icon)
        .setTimestamp()
        message.channel.send(queueEmbed)
       
    }
}
