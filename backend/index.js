import { WebSocketServer } from "ws"
import db  from'./config/db.js'
import express from 'express'
const app = express()

app.get('/', (req,res)=> {
    res.send('hello ')
})

app.get('/signup', (req,res) => {
    res.send('account created')
})

app.listen(3000)
// const wss = new WebSocketServer({port:8080})  

//     let allSocket = {}

//     wss.on("connection" , (socket) => {  //whenever there is a connectn to this webSocketServer call this fn and give it a socket
//         console.log('user Connected')

//         socket.on("message" , (msg) => {
//             const parsedMsg = JSON.parse(msg)  // since msg that is coming is string u need to conver it to obj

//             if(parsedMsg.type === 'join')
//             {
//                 const roomId = parsedMsg.payload.roomId;
//                 if(!allSocket[roomId]){
//                     allSocket[roomId] = [];
//                 }
//                 allSocket[roomId].push(socket);
//                 console.log('user joined')
//                 socket.room = roomId  //attaching a room field in socket itself , so that later the room of the socket can be identified instantly
//             }

//             if(parsedMsg.type === 'chat')
//             {
//                 const roomId = socket.room;
//                 if(!roomId) // check if socket has a room 
//                     return console.log('user not in any room')
//                 if(!allSocket[roomId])  // check if the room exist in our server
//                     return console.log('room doesnt exist')
                
//                 const clients = allSocket[roomId]

//                 const msgWithTime = {
//                     msg: parsedMsg.payload.msg,
//                     time : new Date()
//                 }

//                 clients.forEach((c) => {
//                     if(c!=socket){
//                         c.send(JSON.stringify(msgWithTime))
//                     }
//                 })   
//             }
//         })

//         // socket.on("disconnect", () => {
//         //     allSocket = allSocket.filter(x => x != socket)
//         // })
// })