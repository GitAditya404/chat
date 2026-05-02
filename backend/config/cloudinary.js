import {v2 as cloudinary} from 'cloudinary'  // v2 is latest cloudinary Api

cloudinary.config({   // connecting backend to cloudinary
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary;