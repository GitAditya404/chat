import mongoose from 'mongoose'

mongoose.connect('mongodb://127.0.0.1/chat',{
     serverSelectionTimeoutMS: 5000
})
.then(()=> {
    console.log('db connected')
})
.catch((e) => {
    console.log('error connecting to db' + e.message)
    process.exit(1)
})

export default mongoose.connection