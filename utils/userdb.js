const low = require('lowdb')
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./database/username.json");
const db = low(adapter);
module.exports = {    
    createDatabase(){
        db.defaults({
            username: [],
        }).write();
        console.log("Default Database Created");
    },
    addUser(discordID, username, uuid){
        db.get("username").push({
            discordID: discordID,
            username: username,
            uuid: uuid
        }).write();
    },
    removeUser(discordID){
        db.get("username").remove({
            discordID: discordID,
        }).write();
    },
    findUser(discordID){
        return db.get("username").find({discordID: discordID}).value();
    },
    isInitalized: db.has("username").value(),

}