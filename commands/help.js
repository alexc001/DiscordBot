const {MessageEmbed} = require('discord.js');
const pagination = require('discord.js-pagination');

module.exports = {
    name: 'help',
    description: 'basic help command',
    async execute(client, message, args, color, options, embed, database, config, chalk){
        message.delete();
        const public = new MessageEmbed()
        .setTitle(options.underlineWrap('Public Commands'))
        .setDescription(options.singleWrap(`${config.prefix}help`)+' Sends this embed\n'+options.singleWrap(`${config.prefix}av`)+' Sends user\'s avatar\n'
        +options.singleWrap(`${config.prefix}ping`)+' Sends user\'s ping\n'+options.singleWrap(`${config.prefix}info`)+' Sends User info\n'
        +options.singleWrap(`${config.prefix}namemc`)+' Shows username\'s minecraft profile\n'+ options.singleWrap(`${config.prefix}mcinfo`)+ ' Sends Minecraft Server info\n'+options.singleWrap(`${config.prefix}gif`)+' Sends Random Gif\n'
        + options.singleWrap(`${config.prefix}link`)+' Links Minecraft Account to Userinfo\n'+ options.singleWrap(`${config.prefix}unlink`)+' Unlinks mc account' 
        )
        
        .setColor(color)

        const moderation = new MessageEmbed()
        .setTitle(options.underlineWrap('Discord Moderation'))
        .setDescription(options.singleWrap(`${config.prefix}ban`)+' Bans member\n'+options.singleWrap(`${config.prefix}clear`)+' Purges messages\n'+options.singleWrap(`${config.prefix}kick`)+' Kicks member\n'+options.singleWrap(`${config.prefix}poll`)+' Starts a poll with multiple options\n'+
        options.singleWrap(`${config.prefix}blacklist`)+' Blacklists someone from using commands\n'+options.singleWrap(`${config.prefix}unblacklist`)+' Allows user to use commands\n')
        .setColor(color)

        const staff = new MessageEmbed()
        .setTitle(options.underlineWrap('Staff Commands'))
        .setDescription(options.singleWrap(`${config.prefix}say`)+' Sends announcement embed\n'+options.singleWrap(`${config.prefix}giveaway`)+' Starts Giveaway\n'+options.singleWrap(`${config.prefix}gdelete`)+' Deletes Giveaway\n'+ options.singleWrap(`${config.prefix}reroll`)+ ' Rerolls giveaway winners\n'
        +options.singleWrap(`${config.prefix}verify`)+' Sends embed for users to react to recieve roles\n'+options.singleWrap(`${config.prefix}ticket`)+' sends embed for users to create tickets')
        .setColor(color)

        const music = new MessageEmbed()
        .setTitle(options.underlineWrap('Music Commands'))
        .setDescription(options.singleWrap(`${config.prefix}play`)+ ' Plays music\n'+options.singleWrap(`${config.prefix}queue`)+' Gets the queue\n'+options.singleWrap(`${config.prefix}repeat`)+' Repeats queue\n'+ options.singleWrap(`${config.prefix}skip`)+' Skips song\n'+options.singleWrap(`${config.prefix}stop`)+ ' Stops the bot from playing')
        .setColor(color)
        const pages = [
            public,
            moderation,
            staff,
            music
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';
        pagination(message, pages, emojiList, timeout).then(msg=>{
            msg.delete({timeout: 120000})
        })
    }
}
