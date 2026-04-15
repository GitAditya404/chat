import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId :  {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    } ,
    content : String,
    timestamp : Date,
    roomId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'room'
    }
})

const message = mongoose.model('message',messageSchema)
export default message