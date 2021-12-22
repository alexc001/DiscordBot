const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'basic poll bot',
    async execute(client, message, args, color, options, embed, database, config, chalk, userdb){
        message.delete();
        if(!message.member.hasPermission('ADMINISTRATOR')){
            options.permissionEmbed(embed, 'You have no perms')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
        let question = args.slice(0).join(" ").replace(/"[^"]+"|[\\S]+"[^"]+/g, '')
        const polls = args.slice(1).join(" ")
        const regex = polls.match(/"[^"]+"|[\\S]+"[^"]+/g)

        if(!polls){
            options.errorEmbed(embed, 'Please provide options to vote upon')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }
        if(regex.length > 9){
            options.errorEmbed(embed, 'You can only have 9 poll options')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            return;
        }

        let str = ''
        let emojis = [
            '1️⃣',
            '2️⃣',
            '3️⃣',
            '4️⃣',
            '5️⃣',
            '6️⃣',
            '7️⃣',
            '8️⃣',
            '9️⃣'
        ]

        let i = 0
        for (const poll of regex) {
            str = str + `${emojis[i]} ${poll}\n\n`
            i++
        }

        const pollembed = new MessageEmbed()
        .setTitle(question)
        .setDescription(str.replace(/"/g, ''))
        .setColor(color)
        .setFooter(`Poll made by ${message.author.username}`)

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {
            time: 20000
        })
        message.channel.send(pollembed).then(msg=>{msg.delete({timeout: 19000})})
        message.channel.send(options.orangeWrap('Is this good Enough?\nResponse with Yes or No')).then(msg=>{msg.delete({timeout: 19000})})
        
        collector.on('collect', m=>{
            if(m.content.includes('Yes')){
                collector.stop('Yes')
                return;
            } else if(m.content.includes('No')){
                collector.stop('No')
                return;
            }
        });


        collector.on('end', async (collected, reason)=>{
            if(reason === 'Yes'){
                let channel = message.guild.channels.cache.find(c=>c.name===config.pollChannel)
                options.successEmbed(embed, "You've finished the process!")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
                channel.send('@everyone')
                const msg = await channel.send(pollembed)
                for (let i = 0; i < regex.length; i++){
                    msg.react(emojis[i])
                }
            } else if(reason === 'No'){
                options.cancelEmbed(embed, "You cancelled the process")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            } else {
                options.cancelEmbed(embed, "Cancelled due to no response in the last 20 seconds")
                message.channel.send(embed).then(msg=>{msg.delete({timeout: 4000})})
            }
        })
    }
}