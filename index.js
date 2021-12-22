const Discord = require('discord.js')
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]})
const config = require('config-yml');
const chalk = require('chalk')
const fs = require('fs')
const fetchall = require('discord-fetch-all')
const color = config.color
const activity = config.list
const prefix = config.prefix;
const database = require('./utils/database');
const userdb = require('./utils/userdb');
const ticketdb = require('./utils/ticketdb');
const options = require('./utils/config');
const {GiveawaysManager} = require('discord-giveaways');
const DisTube = require('distube');
const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./database/giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file=>file.endsWith('.js'))
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

if(!database.isInitalized){
    database.createDatabase();
} else console.log(chalk.greenBright('Database has been loaded'))

if(!ticketdb.isInitalized){
    ticketdb.createDatabase();
} else console.log(chalk.redBright('TicketDB has been loaded'))

if(!userdb.isInitalized){
    userdb.createDatabase();
} else console.log(chalk.redBright('UserDB has been loaded'))

client.once('ready', ()=>{
    console.log(chalk.greenBright(`${client.user.username} has logged on`))
    let i = 0;
	setInterval(() => client.user.setActivity(`${activity[i++ % activity.length]}`, { type: 'WATCHING' }), 15000)
})

client.on('guildMemberAdd', member=>{
    if(config.toggleWelcome === false){
        console.log(chalk.redBright('Welcome Function is turned off'))
        return;
    } else if(config.toggleWelcome === true){
    const {guild} = member
    const {name, memberCount} = guild
    const icon  = guild.iconURL({dynamic: true})
    var channel1 = member.guild.channels.cache.find(c=>c.name===config.welcomeChannel);
    if(!channel1){return console.log(chalk.redBright('Welcome Channel not found!'))}
    var channel2 = member.guild.channels.cache.find(c=>c.name===config.announcementChannel);
    if(!channel2){return console.log(chalk.redBright('Announcement Channel not found!'))}
    var channel3 = member.guild.channels.cache.find(c=>c.name===config.rulesChannel)
    if(!channel3){return console.log(chalk.redBright('Rules Channel not found!'))}
    var channel4 = member.guild.channels.cache.find(c=>c.name===config.ticketChannel)
    if(!channel4){return console.log(chalk.redBright('Support Channel not found!'))}
    const welcomeEmbed = new Discord.MessageEmbed()
    .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
    .setDescription(`**Welcome to ${name}**, ${member.user.username}\n\n **Please make sure to check** <#${channel2.id}> & <#${channel3.id}>\n**For Support go to** <#${channel4.id}>\n**MemberCount:** ${options.boldWrap(memberCount)}`)
    .setColor(color)
    .setFooter('Time Joined',icon)
    .setTimestamp()
    channel1.send(welcomeEmbed)
    } else {
        console.log(chalk.redBright('Error: No Valid Value found'))
        return;
    }
})

client.on('message', message=>{
    if(!message.content.startsWith(prefix)|| message.author.equals(client.user)) return;
    if(message.channel.type === 'dm'){return message.author.send('Commands can\'t be sent in dms')}
    let blacklisted = database.findBlacklist(message.author.id);
    if(blacklisted){
        message.channel.send(`You are blacklisted from using the bot. Please open a support ticket`).then(msg=>{
            msg.delete({timeout: 4000})
        }) 
    }
    const args = message.content.slice(prefix.length).split(" ");
    const command = args.shift().toLocaleLowerCase();
    let embed = new Discord.MessageEmbed().setTimestamp();
    if(!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(client, message, args, color, options, embed, database, config, chalk, userdb, distube);
    } catch(error){
        console.error(error);
        message.reply('There was an error').then(msg=>{
            msg.delete({timeout: 3000})
        })
    }
})

client.on('messageReactionAdd', async (reaction, user)=>{
    const guild = reaction.message.guild
    const {name} = guild
    const icon = guild.iconURL({dynamic: true})
    let message = reaction.message, emoji = reaction.emoji
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return;
    let blacklisted = database.findBlacklist(message.author.id);
    let verifyRole = message.guild.roles.cache.find(r=>r.name===config.verifyRole);
    if(!verifyRole){return console.log(chalk.redBright('Check Config.verifyRole in YML'))}
    
    let channel2 = message.guild.channels.cache.find(c=>c.name===config.verifyChannel);
    if(!channel2){return console.log(chalk.redBright('Check config.verifyChannel in YML File'))}
    
    if(emoji.name === config.verifyEmoji && message.channel.id === channel2.id || emoji.id === config.verifyEmoji && message.channel.id === channel2.id){
        reaction.users.remove(user) 
        message.guild.members.fetch(user.id).then(member=>{member.roles.add(verifyRole)})
        reaction.users.remove(user)
        } 
    
    let channel1 = message.guild.channels.cache.find(c=>c.name===config.ticketChannel);
    if(!channel1){return console.log(chalk.redBright('Check config.ticketChannel in YML file'))}
 
    let ticketsupportRole = message.guild.roles.cache.find(r=>r.name===config.ticketsupport)
    if(!ticketsupportRole){return console.log(chalk.redBright('check config.ticketsupport in YML file'))}

    let modRole = message.guild.roles.cache.find(r=>r.name===config.modRole)
    if(!modRole){return console.log(chalk.redBright('check config.modRole in YML file'))}

    let adminRole = message.guild.roles.cache.find(r=>r.name===config.adminRole)
    if(!adminRole){return console.log(chalk.redBright('check config.adminRole in YML file'))}
 
    const ticketOpen = new Discord.MessageEmbed()
    .setDescription('You already have a ticket open').setColor(color)
 
if(emoji.name === config.ticketEmoji && message.channel.id === channel1.id || emoji.id === config.ticketEmoji && message.channel.id === channel1.id){
    reaction.users.remove(user) 
        if(blacklisted){
            user.send('You are blacklisted from making tickets').catch((e)=>{
                console.log(`Unable to send Message To ${user.username}`)
                message.channel.send(`${user.username} Please allow the bot to dm you`).then(msg=>{msg.delete({timeout: 5000})})
            })
            reaction.users.remove(user)
            return;
        }
        let guildFind = await ticketdb.findGuild(guild.id)
        if(!guildFind){return ticketdb.addGuild(guild.id, 0)}
        let ticketFind = await ticketdb.findTicket(user.id)
        if(ticketFind){
            let channel = reaction.message.guild.channels.cache.get(ticketFind.channelID)
            if(channel){
                user.send(ticketOpen).catch((e)=>{
                    console.log(`Unable to send Message To ${user.username}`)
                    message.channel.send(`${user.username} Please allow the bot to dm you`).then(msg=>{msg.delete({timeout: 5000})})
                })
                reaction.users.remove(user)
        } 
        else {
            let data = guildFind.ticketnum+=1
            ticketdb.updateGuild(guildFind, data)
            console.log(chalk.redBright('User was in db but no channel exists...Channel Updated'))
            let testchannel = reaction.message.guild.channels.create(`ticket-${guildFind.ticketnum}`,{
                type: "text",
                permissionOverwrites: [
                    {
                        id: user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: guild.roles.cache.find(r=>r.name===config.ticketsupport),
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    },

                ]

            }).then(async ch=>{
                let ticketFind = ticketdb.findTicket(user.id)
                ticketFind.channelID = ch.id
                ticketdb.updateTicket(ticketFind)
                let channel3 = message.guild.channels.cache.find(c=>c.name===config.undecided);
                if(!channel3){return console.log(chalk.redBright('Check config.undecided in YML file'))}
                ch.setParent(channel3, {lockPermissions: false})
                let ticketReact = new Discord.MessageEmbed()
                .setTitle(`${name}`)
                .setDescription(`${config.generalCustomEmoji}`+options.singleWrap('For general support\n')+`${config.adminCustomEmoji}`+options.singleWrap('For admin Support\n')+`${config.paymentCustomEmoji}`+options.singleWrap('For payment support'))
                .setFooter('Opened By: '+ user.username, icon)
                .setColor(color)
                await ch.send(`<@${user.id}>`).then(msg=>{
                    msg.delete({timeout: 2000})
                })
                ch.send(ticketReact).then(async msgEmbed=>{
                    await msgEmbed.react(config.generalEmoji);
                    await msgEmbed.react(config.adminEmoji)
                    await msgEmbed.react(config.paymentEmoji)
                })
               })
        }
    } else {
        let data = guildFind.ticketnum+=1
        ticketdb.updateGuild(guildFind, data)
        let testchannel = reaction.message.guild.channels.create(`ticket-${guildFind.ticketnum}`,{
            type: "text",
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
                {
                    id: message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: message.guild.roles.cache.find(r=>r.name===config.ticketsupport),
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                },

            ]

        }).then(async ch=>{
            ticketdb.addTicket(user.id, ch.id)
            let channel4 = message.guild.channels.cache.find(c=>c.name===config.undecided);
            if(!channel4){return console.log(chalk.redBright('Check config.undecided in YML file'))}
                ch.setParent(channel4, {lockPermissions: false})
                let ticketReact = new Discord.MessageEmbed()
                .setTitle(`${name}`)
                .setDescription(`${config.generalCustomEmoji}`+options.singleWrap('For general support\n')+`${config.adminCustomEmoji}`+options.singleWrap('For admin Support\n')+`${config.paymentCustomEmoji}`+options.singleWrap('For payment support'))
                .setFooter('Opened By: '+ user.username, icon)
                .setColor(color)
                ch.send(`<@${user.id}>`).then(msg=>{
                    msg.delete({timeout: 2000})
                })
                ch.send(ticketReact).then(async msgEmbed=>{
                    await msgEmbed.react(config.generalEmoji);
                    await msgEmbed.react(config.adminEmoji)
                    await msgEmbed.react(config.paymentEmoji)
                })
               
        })
    }
}

if(emoji.name ===config.generalEmoji && message.channel.name.includes('ticket-') || emoji.id === config.generalEmoji && message.channel.name.includes('ticket-') ){ 
    let generalChannel = message.guild.channels.cache.find(c=>c.name=== config.general && c.type==='category');
    message.channel.setParent(generalChannel, {lockPermissions: false})
    message.delete();
    const generalEmbed = new Discord.MessageEmbed()
    .setTitle(`${name} Support`)
    .setDescription(`<@${user.id}> opened a **General** support ticket\nPlease be patient until staff respond!\nIf ticket is settled please react to close!`)
    .setColor(color).setFooter('Time Opened', icon).setTimestamp()
    message.channel.send(generalEmbed).then(msg=>{
        msg.react(config.closeEmoji);
    })

    message.channel.send('@here').then(msg=>{msg.delete({timeout: 2000})})
}

if(emoji.name ===config.adminEmoji && message.channel.name.includes('ticket-') || emoji.id === config.adminEmoji && message.channel.name.includes('ticket-') ){
    let adminChannel = message.guild.channels.cache.find(c=>c.name===config.admin && c.type === 'category')
    message.channel.setParent(adminChannel, {lockPermissions: false})
    message.delete();
    const adminEmbed = new Discord.MessageEmbed()
    .setTitle(`${name} Admin Support`)
    .setDescription(`<@${user.id}> opened an **Admin** support ticket\nPlease be patient until staff respond!\nIf ticket is settled please react to close!`)
    .setColor(color).setFooter('Time Opened', icon).setTimestamp()
    message.channel.updateOverwrite(message.guild.roles.cache.find(r=>r.name===config.ticketsupport), {'VIEW_CHANNEL': false, 'SEND_MESSAGES': false, 'MENTION_EVERYONE': false})
    message.channel.updateOverwrite(message.guild.roles.cache.find(r=>r.name===config.adminRole), {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true, 'MENTION_EVERYONE': false})
    message.channel.send(adminEmbed).then(msg=>{
        msg.react(config.closeEmoji)
    })
    message.channel.send('@here').then(msg=>{msg.delete({timeout: 2000})})
    
}

if(emoji.name ===config.paymentEmoji && message.channel.name.includes('ticket-') || emoji.id === config.paymentEmoji && message.channel.name.includes('ticket-') ){ 
    let paymentChannel = message.guild.channels.cache.find(c=>c.name===config.payment && c.type === 'category')
    message.channel.setParent(paymentChannel, {lockPermissions: false})
    message.delete();
    const paymentEmbed = new Discord.MessageEmbed()
    .setTitle(`${name} Payment Support`)
    .setDescription(`<@${user.id}> opened a **Payment** support ticket\nPlease be patient until staff respond!\nIf ticket is settled please react to close!`)
    .setColor(color).setFooter('Time Opened', icon).setTimestamp()
    message.channel.updateOverwrite(message.guild.roles.cache.find(r=>r.name===config.ticketsupport), {'VIEW_CHANNEL': false, 'SEND_MESSAGES': false, 'MENTION_EVERYONE': false})
    message.channel.updateOverwrite(message.guild.roles.cache.find(r=>r.name===config.adminRole), {'VIEW_CHANNEL': true, 'SEND_MESSAGES': true, 'MENTION_EVERYONE': false})
    message.channel.send(paymentEmbed).then(msg=>{
        msg.react(config.closeEmoji)
    })
    message.channel.send('@here').then(msg=>{msg.delete({timeout: 2000})})
}

if(emoji.name ===config.closeEmoji && message.channel.name.includes('ticket-') || emoji.id === config.closeEmoji && message.channel.name.includes('ticket-') ){
    reaction.users.remove(user) 
    const closeEmbed = new Discord.MessageEmbed()
        .setTitle('Closing Ticket')
        .setDescription('Your Ticket Has Been Closed and Transcript has been sent').setColor(color)
        let channelLogs = message.guild.channels.cache.find(c=>c.name===config.ticketlogChannel);
        if(!channelLogs){return console.log(chalk.redBright('Check config.ticketChannel in YML File'))}
        let userID = ticketdb.findChannel(message.channel.id)
        const logEmbed = new Discord.MessageEmbed()
        .setTitle(options.underlineWrap('Ticket Closed'))
        .setDescription(`Your ticket has been closed!\n\nClose By: <@${user.id}>\nTicket Owner: <@${userID.userID}>\nTicket ID: ${message.channel.name}\nReason: **resolved**`)
        .setColor(color)

        const msgs = await fetchall.messages(message.channel, {
            reverseArray: true
        })

        const content = msgs.map(m => `${m.author.tag} - ${m.content}`)
        fs.writeFileSync('transcript.txt', content.join('\n'), error=>{
            if(error) throw error
        })
        message.channel.send(closeEmbed)
        client.users.fetch(userID.userID).then((usser)=>{
            let attatchment = new Discord.MessageAttachment('transcript.txt', `${message.channel.name}-${usser.username}.txt`)
            usser.send(logEmbed).catch((e)=>{
                console.log(`Unable to send Message To ${user.username}`)
                message.channel.send(`${user.username} Please allow the bot to dm you`).then(msg=>{msg.delete({timeout: 5000})})
            })
            usser.send(attatchment).catch((e)=>{
                console.log(`Unable to send Message To ${user.username}`)
                message.channel.send(`${user.username} Please allow the bot to dm you`).then(msg=>{msg.delete({timeout: 5000})})
            })
            channelLogs.send(logEmbed)
            channelLogs.send(attatchment)
            
        })
        let data = ticketdb.removeTicket(userID.userID, message.channel.id)

        setTimeout(() => {
          
           message.channel.delete();
            
        }, 10000)
}
   
        
})

const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

//Someone showed me how to do the distube events
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
   
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });

client.login(config.token)