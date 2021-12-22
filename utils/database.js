const low = require('lowdb')
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./database/blacklist.json");
const db = low(adapter);

module.exports = {
    createDatabase(){
        db.defaults({
            blacklist: [],
        }).write();
        console.log("Default Database Created");
    },
    addBlacklist(discordID){
        db.get("blacklist").push({
            discordID: discordID,
        }).write();
    },
    removeBlacklist(discordID){
        db.get("blacklist").remove({
            discordID: discordID,
        }).write();
    },
    findBlacklist(discordID){
        return db.get("blacklist").find({discordID: discordID}).value();
    },
    isInitalized: db.has("blacklist").value(),
}
