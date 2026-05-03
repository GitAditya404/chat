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
        type : String,
        required : true
    },
    about : String,
    phoneNo : Number,
    profilePic : {
        type : String,
        default : 'defaultImg.jpg'
    }       
})

const user = mongoose.model('user',userSchema)
export default user