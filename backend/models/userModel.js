import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required: true
    },
    fullname : {
        type : String,
        trim : true,
        required : true
    },
    password : {
        type : String
    },
    about : String,
    phoneNo : Number,
    profilePic : {
        type : String,
        default : 'defaultImg.jpg'
    },
    googleAccessToken : String // used for calender API      
})

const user = mongoose.model('user',userSchema)
export default user