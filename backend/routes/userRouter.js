import express from 'express'
const router = express.Router()
import userModel from '../models/userModel.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'
import {registerUser , loginUser , logout} from '../controllers/authController.js'
import upload from '../middlewares/multerConfig.js'
import cloudinary from '../config/cloudinary.js'

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

router.post('/profile/pic',isLoggedIn, upload.single('profileImg') , async (req,res) => {
  try{
    //does file exists
    if(!req.file)
      return res.status(400).json({
        msg : "No image uploaded"
      })
    
    // convert buffer to base64 b/c cloudinary accepts base64
    const imgBase64 = req.file.buffer.toString('base64')
    const imgUri = `data:${req.file.mimetype};base64,${imgBase64}`;

    //uploading in cloudinary
    const result = await cloudinary.uploader.upload(imgUri, {
        folder: "profile_images",
    });
    // console.log(result)
    
    const value = await userModel.findByIdAndUpdate(req.user._id, {
      profilePic: result.secure_url,  // result gives secure_url which has img link
    });
    
    res.json({
      msg : "Upload Successful",
      imgUrl : result.secure_url
    })
  }

  catch(err){
    console.log(err)
    res.status(500).json({
      msg :"Internal Server error"
    })
  }
})

export default router