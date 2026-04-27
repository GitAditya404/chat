import mongoose from 'mongoose'

mongoose.connect(process.env.MongoDb_URI,{
     serverSelectionTimeoutMS: 5000
})
.then(()=> {
    console.log('db connected')
    console.log(mongoose.connection.name);
})
.catch((e) => {
    console.log('error connecting to db ' + e.message)
    process.exit(1)
})

export default mongoose.connection