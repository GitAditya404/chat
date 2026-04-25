import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique: true
    },
    members : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user'
        }
    ]
})

const room = mongoose.model('room',roomSchema)

export default room