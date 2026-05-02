import express from 'express'
const router = express.Router()

import roomModel from '../models/roomModel.js'


router.get('/',isLoggedIn ,async (req,res) => {
    const rooms = await roomModel.find({members:req.user._id})
    res.send(rooms)
})

router.get('/me' , isLoggedIn , (req,res) => {
  res.status(200).send('user verified')
})

router.get('/health' , (req,res) => {
  res.status(200).json({
    status : "OK" , 
    time : new Date()
  })
})