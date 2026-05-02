import express from 'express'
const router = express.Router()
import userModel from '../models/userModel.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'
import {registerUser , loginUser , logout} from '../controllers/authController.js'

router.post('/signup',registerUser)   // route -> /user/signup
router.post('/login',loginUser)
router.post('/logout',logout)

router.get('/profile' , isLoggedIn , async (req,res) => {
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

router.post('/profile/save' , isLoggedIn , async (req,res) => {
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

export default router