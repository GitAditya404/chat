import 'dotenv/config'
import { WebSocketServer } from "ws"
import db  from'./config/db.js'
import express from 'express'
import cookieParser from "cookie-parser"
import {loginUser, registerUser ,logout} from './controllers/authController.js'
import isLoggedIn from "./middlewares/isLoggedIn.js"
import cors from 'cors'
import roomModel from './models/roomModel.js'
import messageModel from './models/messageModel.js'
import userModel from "./models/userModel.js"
import verifyUser from "./utils/verifyUser.js"
import zod from 'zod'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "chat-frontend-ivory-eta.vercel.app",
  credentials: true
}));

app.post('/signup',registerUser)
app.post('/login',loginUser)
app.post('/logout',logout)

app.get('/',isLoggedIn ,async (req,res) => {
    const rooms = await roomModel.find({members:req.user._id})
    res.send(rooms)
})

app.get('/me' , isLoggedIn , (req,res) => {
  res.status(200).send('user verified')
})

app.get('/creator', isLoggedIn ,async (req,res) => {
  const {roomId} = req.query;

  const room = await roomModel.findOne({_id : roomId})
  if(room.members[0].toString() === req.user._id.toString())
    return res.status(200).send(true)
  return res.status(200).send(false)
})


app.post('/room/join', isLoggedIn,async (req,res) => {

  const bodySchema = zod.object({
        name: zod.string().regex(/^[a-zA-Z0-9]+$/)
  })

  const result = bodySchema.safeParse(req.body)

  if(!result.success)
        return res.status(400).json ({
          msg : "Name must contain only letters and numbers "
    })

  const {name} = result.data;

  try{
    const room  = await roomModel.findOneAndUpdate({name :name.toLowerCase()},
       {$addToSet :{members: req.user._id}}, //user can join only once
      {new:true}
    )
    if(!room)
      res.status(404).json({
        msg : "Room does not exist"
      })

    return res.status(200).json({
      msg : `Joined ${name} successfully`
    })
  }
  
  catch(e){
    return res.status(500).json({
      msg : "Internal Server Error"
    })
  }

})

app.post('/room/create' , isLoggedIn ,async (req,res) =>{

    const bodySchema = zod.object({
        name: zod.string().regex(/^[a-zA-Z0-9]+$/)
    })

    const result = bodySchema.safeParse(req.body)
    if(!result.success)
        return res.status(400).json ({
          msg : "Name must contain only letters and numbers "
    })

    const {name} = result.data;

    try{
      const check = await roomModel.findOne({name : name})
      if(check)
        return res.status(403).json({
          msg : "Name not available"
        })
      const room = await roomModel.create({
        name:name.toLowerCase(),
        members : [req.user._id]
      })
      return res.status(200).json({
        msg : `created ${name} successfully`
      })
    }

    catch(e){
      return res.status(500).json({
        msg: "Unable to create Room"
      })
    }
})


app.post('/room/delete' , isLoggedIn , async (req,res) => {
  const {roomId} = req.body;
  try{
    const room = await roomModel.findOne({_id : roomId})
    if(!room)
      return res.status(404).json({
        msg : "Room not found"
    })

    if(room.members[0].toString() !== req.user._id.toString())
      return res.status(403).json({
          msg : "Only Creator can delete Room"
    })

    await roomModel.deleteOne({_id : roomId})

    await messageModel.deleteMany({roomId : roomId})  //deleting all msg of this room

    delete allSocket[roomId]  // delete room from websocket

    return res.status(200).json({
      msg : "Room deleted successfully"
    })
      
  }
  catch(err){
    return res.status(500).json({
      msg : "Internal Server error"
    })
  }
  
})

app.post('/room/leave' , isLoggedIn,async (req,res) => {
    const {roomId} = req.body;

    try{

      const room = await roomModel.findOne({_id: roomId})
      if(!room)
        return res.status(404).json({
            msg : "Room not found"
        })

      //when i leave then through frontend useEffect cleanup in backend allSocket filters the socket , so no need to do it here
      
      await roomModel.updateOne({_id : roomId}, {$pull : {members : req.user._id}})
      return res.status(200).json({
        msg : "Left room successfully"
      })
    }

    catch(err){
      return res.status(500).json({
        msg : "Internal Server Error"
      })
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

app.get('/profile' , isLoggedIn , async (req,res) => {
    try{
        const data = await userModel.findOne({_id :req.user._id}).select('-password')
        if(!data)
          return res.status(404).json({
              msg : "User not found"
        })
        return res.status(200).send(data)
    }

    catch(err){
      return res.status(500).json({
        msg : "Internal server error"
      })
    }

})

app.post('/profile/save' , isLoggedIn , async (req,res) => {
  const {data} = req.body;

  try{
    await userModel.updateOne({_id : req.user._id},
      {
        fullname : data.fullname,
        about : data.about,
        phoneNo : data.phoneNo
      }
    )
    return res.status(200).json({msg : "Saved !"})
  }
  catch(err){
    return res.status(500).json({msg : "Internal Server Error"})
  }

})

// app.listen(process.env.PORT || 3000)
server.listen(process.env.PORT || 3000, () => {
  console.log("server running");
});

                                  //WEBSOCKET SERVER
// const wss = new WebSocketServer({port:8080})  
const wss = new WebSocketServer({ server });

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
          if(allSocket[roomId]){
              allSocket[roomId] = allSocket[roomId].filter(x => x !== socket)
            }
        })

})