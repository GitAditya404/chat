import { WebSocketServer } from "ws"
import db  from'./config/db.js'
import express from 'express'
import cookieParser from "cookie-parser"
import {loginUser, registerUser} from './controllers/authController.js'
import isLoggedIn from "./middlewares/isLoggedIn.js"
const app = express()
app.use(express.json())
app.use(cookieParser())


app.get('/',isLoggedIn ,(req,res)=> {
    res.send(req.user)
})

app.post('/signup',registerUser)
app.post('/login',loginUser)

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