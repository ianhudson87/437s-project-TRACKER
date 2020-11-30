const express = require('express')
import dbConfig from "./config/db"
import middlewaresConfig from './config/middlewares'
import {TrackerRoutes, UpdateStats} from './modules'
var cors = require('cors')

const app = express();
app.use(cors())

/**
 * Database
 */
dbConfig();

/**
 * Api
 */
middlewaresConfig(app);

app.use('/api', [TrackerRoutes])

const PORT = process.env.PORT || 3000;

const server = require("http").createServer(app);
server.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('APP LISTENING HAHAHAJDIOWAJDPOIWAJDpoi');
    }
});

/**
 * socket.io
 */
const io = require("socket.io").listen(server);
io.on("connection", socket => {
    console.log("a user connected :D");
    
    socket.on('join_room', (data)=>{
        socket.join(data.game_id)
        console.log('user joined room:', data.game_id)
    })

    socket.on('changed_score', (data)=>{
        io.sockets.in(data.game_id).emit('refresh_score')
    })


});

/**
 * Updating stats of users and groups
 */
setInterval(UpdateStats, 3*1000)