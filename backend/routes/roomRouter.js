import express from 'express'
const router = express.Router()
import roomModel from '../models/roomModel.js';
import zod from 'zod'
import isLoggedIn from '../middlewares/isLoggedIn.js';
import messageModel from '../models/messageModel.js'
import {allSocket} from '../webSocket.js'

router.get('/all',isLoggedIn ,async (req,res) => {
    const rooms = await roomModel.find({members:req.user._id})
    res.send(rooms)
})

router.get('/creator', isLoggedIn ,async (req,res) => {
  const {roomId} = req.query;

  const room = await roomModel.findOne({_id : roomId})
  if(room.members[0].toString() === req.user._id.toString())
    return res.status(200).send(true)
  return res.status(200).send(false)
})

router.post('/join', isLoggedIn,async (req,res) => {  //route-> /room/join

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
      return res.status(404).json({
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

router.post('/create' , isLoggedIn ,async (req,res) =>{

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


router.post('/delete' , isLoggedIn , async (req,res) => {
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

router.post('/leave' , isLoggedIn,async (req,res) => {
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

export default router