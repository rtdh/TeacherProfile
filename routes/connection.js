const express = require('express')
const mysql = require('mysql')
const app = express.Router()

require('dotenv/config')
global.db;

function handleDisconnect(){
    db = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    }); // Recreate the connection, since the old one cannot be reused.

    db.connect(function(err){
        if(err){ // The server is either down if(err) { or restarting (takes a while sometimes).
            console.log('Mysql error connecting: ' + err.stack);
            setTimeout(handleDisconnect, 2000) // We introduce a delay before attempting to reconnect,
        } else {
            console.log('Mysql connection successful with ' + db.threadId);
        }
    })

    db.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}
handleDisconnect()
module.exports = {db : db}
module.exports = app;