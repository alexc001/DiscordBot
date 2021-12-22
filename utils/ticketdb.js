const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./database/ticketdb.json");
const db = low(adapter);

module.exports = {
    createDatabase(){
        db.defaults({
            guilds: [],
            tickets: [],
        }).write();
        console.log("Ticket Database has been created")
    },
    addGuild(guildID, ticketnum){
        db.get("guilds").push({
            guildID: guildID,
            ticketnum: ticketnum,
        }).write();
    },
    findGuild(guildID){
        return db.get("guilds").find({guildID: guildID}).value();
    },
    updateGuild(guildID, ticketnum){
        db.get("guilds")
        .find({guildID: guildID})
        .update("ticketnum", ticketnum)
        .write();
    },
    addTicket(userID, channelID){
        db.get("tickets").push({
            userID: userID,
            channelID: channelID
        }).write();
    },
    removeTicket(userID, channelID){
        db.get("tickets").remove({
            userID: userID,
            channelID: channelID
        }).write();
    },
    findTicket(userID){
        return db.get("tickets").find({userID: userID}).value();
    },
    findChannel(channelID){
        return db.get("tickets").find({channelID: channelID}).value();
    },
    updateTicket(userID, channelID){
        db.get("tickets")
        .find({userID: userID})
        .update("channelID", channelID)
        .write();
    },
    isInitalized: db.has("guilds").value(),
}