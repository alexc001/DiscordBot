const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch')
module.exports = {
    name: 'gif',
    description: 'basic gif sending command',
    async execute(client, message, args, color, options, embed, database, config, chalk){

        message.delete();
        const apikey = config.tenor
        if(!apikey){
            options.errorEmbed(embed, 'Please create an API KEY for TENOR')
            message.channel.send(embed).then(msg=>{msg.delete({timeout: 5000})})
        }
        let keywords = args.slice(0).join(" ")
        if(!keywords){
            options.errorEmbed(embed, "Please add a keyword to search gif for")
            message.channel.send(embed).then(msg=>{
                msg.delete({timeout: 5000})
    
            })
            return;
        }

        const url = `https://g.tenor.com/v1/search?q=${keywords}&key=${apikey}`  
        let response = await fetch(url)
        let json = await response.json();
        const index = Math.floor(Math.random() * json.results.length)

        message.channel.send(json.results[index].url);


    }
}

