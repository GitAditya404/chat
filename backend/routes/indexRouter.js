import express from 'express'
const router = express.Router()

import roomModel from '../models/roomModel.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'

router.get('/me' , isLoggedIn , (req,res) => {
  res.status(200).send('user verified')
})

router.get('/health' , (req,res) => {
  res.status(200).json({
    status : "OK" , 
    time : new Date()
  })
})

export default router