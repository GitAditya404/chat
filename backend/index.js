import { WebSocketServer } from "ws"
import db  from'./config/db.js'
import express from 'express'
import cookieParser from "cookie-parser"
import {loginUser, registerUser} from './controllers/authController.js'
import isLoggedIn from "./middlewares/isLoggedIn.js"
import cors from 'cors'
import roomModel from './models/roomModel.js'
import messageModel from './models/messageModel.js'
import verifyUser from "./utils/verifyUser.js"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.post('/signup',registerUser)
app.post('/login',loginUser)

app.get('/',isLoggedIn ,async (req,res) => {
    const rooms = await roomModel.find({members:req.user._id})
    res.send(rooms)
    // console.log(rooms)
})

app.get('/me' , isLoggedIn , (req,res) => {
  res.status(200).send('user verified')
})


app.post('/room/join', isLoggedIn,async (req,res) => {

  try{
    const {name} = req.body;
    const room  = await roomModel.findOneAndUpdate({name},
       {$addToSet :{members: req.user._id}},
      {new:true}
    )
    if(!room)
      res.status(404).send('Room does not exist')

    return res.status(200).send('joined ' + req.body.name+' successfully')
  }
  
  catch(e){
    return res.status(500).send('Server error')
  }

})

app.post('/room/create' , isLoggedIn ,async (req,res) =>{
    try{
      const {name} = req.body;
      const room = await roomModel.create({
        name:name,
        members : [req.user._id]
      })
      return res.status(200).send('created '+name +' successfully')
    }

    catch(e){
      return res.status(500).send('unable to create join room')
    }
})

app.post('/msg/create' , isLoggedIn ,async (req,res)=> {

  const {roomId, content} = req.body;

  await messageModel.create({
    senderId: req.user._id,
    roomId : roomId,
    content : content,
    timestamp : new Date()
  })
  return res.status(200).send('message saved in DB')
})

app.get('/msg', isLoggedIn,async (req,res) => {
  const {roomId} = req.query

  let data = await messageModel.find({roomId}).populate('senderId')
  data = data.map((msg) => {

    // if(msg.senderId === req.user._id) // this wont work b/c both are objectIds and in js object is compared by reference not by value , so it will always be false
    if(msg.senderId._id.toString() === req.user._id.toString())
    {
      return {
        content : msg.content,
        timestamp : msg.timestamp,
        type : "sent",
        senderName : "you"
      }
    }
    else{
      return {
        content : msg.content,
        timestamp : msg.timestamp,
        type : "received",
        senderName : msg.senderId.fullname
      }
    }
  })
  return res.status(200).send(data)
})

app.listen(3000)

                                  //WEBSOCKET SERVER
const wss = new WebSocketServer({port:8080})  

  let allSocket = {}

    wss.on("connection" , (socket ,req) => {  //whenever there is a connectn to this webSocketServer call this fn and give it a socket
        console.log('user Connected')

        socket.on("message" , async (msg) => {
            const parsedMsg = JSON.parse(msg)  // since msg that is coming is string u need to conver it to obj


            if(parsedMsg.type === 'join')
            {
                const roomId = parsedMsg.payload.roomId;
                if(!allSocket[roomId]){  // if room not present in allSocket ,create it
                    allSocket[roomId] = [];
                }

                allSocket[roomId].push(socket);
                console.log('user joined' + roomId)
                socket.room = roomId  //attaching a room field in socket itself , so that later the room of the socket can be identified instantly
            }

            if(parsedMsg.type === 'chat')
            {
                // const token = req.cookies.token //this wont work here b/c this req does not pass through express cookie parser 
                const cookies  = req.headers.cookie  // o/p -> token=abc123; theme=dark
                const token = cookies?.split('; ')
                              .find(row => row.startsWith('token='))
                              ?.split('=')[1];

                const user = await verifyUser(token)

                const roomId = socket.room;
                if(!roomId) // check if socket has a room 
                    return console.log('user not in any room' + roomId)
                
                const clients = allSocket[roomId]

                const msgWithTime = {
                    content: parsedMsg.payload.msg,
                    senderName : user.fullname,
                    timestamp : new Date()
                }

                clients.forEach((c) => {
                    if(c!=socket){
                        c.send(JSON.stringify(msgWithTime))
                    }
                })   
            }
        })
        socket.on('close',() => {
          const roomId = socket.room
          allSocket[roomId] = allSocket[roomId].filter((x) => x!== socket)
        })

})