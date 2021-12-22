const {MessageEmbed} = require('discord.js');
const pagination = require('discord.js-pagination');

module.exports = {
    name: 'help',
    description: 'basic help command',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        const public = new MessageEmbed()
        .setTitle(options.underlineWrap('Public Commands'))
        .setDescription(options.singleWrap(`.help`)+' Sends this embed\n'+options.singleWrap('.av')+' Sends user\'s avatar\n'
        +options.singleWrap('.ping')+' Sends user\'s ping\n'+options.singleWrap('.info')+' Sends User info\n'
        +options.singleWrap('.namemc')+' Shows username\'s minecraft profile\n'+ options.singleWrap('.mcinfo')+ ' Sends Minecraft Server info\n'+options.singleWrap('.gif')+' Sends Random Gif\n'
        + options.singleWrap('.link')+' Links Minecraft Account to Userinfo\n'+ options.singleWrap('.unlink')+' Unlinks mc account' 
        )
        
        .setColor(color)

        const moderation = new MessageEmbed()
        .setTitle(options.underlineWrap('Discord Moderation'))
        .setDescription(options.singleWrap(`.ban`)+' Bans member\n'+options.singleWrap('.clear')+' Purges messages\n'+options.singleWrap('.kick')+' Kicks member\n'+options.singleWrap('.poll')+' Starts a poll with multiple options\n'+
        options.singleWrap('.blacklist')+' Blacklists someone from using commands\n'+options.singleWrap('.unblacklist')+' Allows user to use commands\n')
        .setColor(color)

        const staff = new MessageEmbed()
        .setTitle(options.underlineWrap('Staff Commands'))
        .setDescription(options.singleWrap('.say')+' Sends announcement embed\n'+options.singleWrap('.giveaway')+' Starts Giveaway\n'+options.singleWrap('.gdelete')+' Deletes Giveaway\n'+ options.singleWrap('.reroll')+ ' Rerolls giveaway winners\n'
        +options.singleWrap('.verify')+' Sends embed for users to react to recieve roles\n'+options.singleWrap('.ticket')+' sends embed for users to create tickets')
        .setColor(color)

        const pages = [
            public,
            moderation,
            staff,
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';
        pagination(message, pages, emojiList, timeout).then(msg=>{
            msg.delete({timeout: 120000})
        })
    }
}