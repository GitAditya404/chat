import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username : String,
    fullname : String,
    password : String,
    about: String

})

const user = mongoose.model('user',userSchema)
export default user