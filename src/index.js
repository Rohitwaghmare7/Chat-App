import path from "path";
import express from "express";
import http from "http";
import {Server} from 'socket.io';
import Filter from "bad-words";
import { generateMessage } from "./util/messages.js";
import { generateLocationMessage } from "./util/messages.js"
import { addUser,removeUser,getUser,getUserInRoom } from "./util/users.js";

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
    
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));


io.on("connection",(socket) =>{
    console.log("New websocket connection");

    socket.on("join",( options,callback) => {
        const {error,user} = addUser({id:socket.id, ...options})
        if (error){
            return callback(error)
        } 
        socket.join(user.room)

        socket.emit('message',generateMessage("Admin","Welcome!"));
        socket.broadcast.to(user.room).emit('message',generateMessage("Admin",""+user.username+" has joined!"))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(message,callback) =>{
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed!");
        }
        io.to(user.room).emit("message",generateMessage(user.username,message))
        callback()
    })

    socket.on("sendlocation",(coords,callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit(
            "locationMessage",generateLocationMessage(user.username,"https://google.com/maps?q="+coords.latitude+""+coords.longitude)
        )
        callback()
    })

    socket.on("disconnect",()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit("message",generateMessage("Admin",user.username+" has left!"))
            io.to(user.room).emit("roomData",{
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }     
    })
})

server.listen(port,()=>{
    console.log("server is up on port "+ port);
});