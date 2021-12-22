const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'av',
    description: 'avatar command',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete()
        const usser = message.mentions.users.first() || message.author;
        const avatarEmbed = new MessageEmbed()
            .setColor(color)
            .setAuthor(usser.username+"\'s Avatar")
            .setImage(usser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
        message.channel.send(avatarEmbed)
    }
}