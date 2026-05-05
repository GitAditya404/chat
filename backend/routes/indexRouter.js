import express from 'express'
const router = express.Router()

import roomModel from '../models/roomModel.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'

// let online = []
router.get('/me' , isLoggedIn , (req,res) => {
  // online.push(req.user._id)
  res.status(200).send('user verified')
})

// router.get('/status', isLoggedIn ,async (req,res) => {
//   const {roomId} = req.query;
//   const user = req.user._id;

//   try{

//     const room = await roomModel.findOne({_id:roomId})
//     if(!room)
//       return res.status(404).json({
//         msg : "Room not found"
//     })


//     if(room.members.length>2)
//       return res.status(403).json({
//         msg : "Status not applicable"
//     })

//     online.forEach((id) =>{
//       if(id.toString() === room.members[0].toString() && id.toString() != user.toString())
//         return res.status(200).json({
//           msg : "Online"
//       })

//       if(id.toString() === room.members[1].toString() && id.toString() != user.toString())
//         return res.status(200).json({
//           msg : "Online"
//       })

//     })

//     return res.status(200).json({
//       msg : "Offline"
//     })

//   }
  
//   catch(err){
//     return res.status(500).json({
//       msg : "Internal Server Error"
//     })
//   }
  
// })

router.get('/health' , (req,res) => {
  res.status(200).json({
    status : "OK" , 
    time : new Date()
  })
})

export default router