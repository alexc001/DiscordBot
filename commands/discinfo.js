const {MessageEmbed} = require('discord.js');
const pagination = require('discord.js-pagination');
const MojangAPI = require('mojang-api')
module.exports ={
    name: 'info',
    description: 'basic discord info command branches off minecraft info',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb){
        message.delete();
        const {guild} = message
        const {name, memberCount, owner, region} = guild
        const icon = guild.iconURL({dynamic: true});
        const boosters = message.guild.premiumSubscriptionCount > 1 ? `There are ${message.guild.premiumSubscriptionCount} Boosters!`: 'There are no boosters'

        const user = message.mentions.users.first() ||  message.author;
        const member = guild.members.cache.get(user.id);

        let linkaccount = userdb.findUser(message.author.id)

        if(linkaccount){
            // let channel = reaction.message.guild.channels.cache.get(ticketFind.channelID)
            linkac = linkaccount.username
            linkuuid = linkaccount.uuid
            url = 'https://crafatar.com/avatars/' + linkuuid + '.png'



        } else {
            linkac = 'None'
            url = null;
        }
        
        const userinfo = new MessageEmbed()
        .setAuthor('User Information')
        .setTitle(user.username+"\'s Information")
        .setDescription(`**<@${user.id}> ID:** ${user.id}\n**Nickname:** ${member.nickname || 'None'}\n**Joined Server:** ${new Date(member.joinedTimestamp).toLocaleDateString()}\n**Joined Discord:** ${new Date(user.createdTimestamp).toLocaleDateString()}\n**Role Count:** ${member.roles.cache.size-1}`)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
        .setColor(color)

        const linkaccounts = new MessageEmbed()
        .setAuthor('User\'s Linked Accounts!')
        .setColor(color)
        .setDescription(`<@${message.author.id}> __**Has the Following Accounts Link:**__\n\n**${config.customDiscEmoji} Minecraft:** ${linkac}`)
        .setThumbnail(url)


        const serverinfo = new MessageEmbed()
        .setAuthor('Server Information')
        .setTitle(name)
        .setDescription(`**Server Owner:** <@${owner.id}>\n**MemberCount:** ${memberCount}\n**Boosters:** ${boosters}\n**Region:** ${region}`)
        .setThumbnail(icon)
        .setColor(color)
        
        
        const pages = [
           userinfo,
           linkaccounts,
           serverinfo
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';
        pagination(message, pages, emojiList, timeout).then(msg=>{
            msg.delete({timeout: 120000})
        })
    }
}