
app.post('/msg/create' , isLoggedIn ,async (req,res)=> {

  const {roomId, content} = req.body;

  await messageModel.create({
    senderId: req.user._id,
    roomId : roomId,
    content : content,
    timestamp : new Date()
  })
  return res.status(200).send('message saved in DB')
})

app.get('/msg', isLoggedIn,async (req,res) => {
  const {roomId} = req.query

  let data = await messageModel.find({roomId}).populate('senderId')
  data = data.map((msg) => {

    // if(msg.senderId === req.user._id) // this wont work b/c both are objectIds and in js object is compared by reference not by value , so it will always be false
    if(msg.senderId._id.toString() === req.user._id.toString())
    {
      return {
        content : msg.content,
        timestamp : msg.timestamp,
        type : "sent",
        senderName : "you"
      }
    }
    else{
      return {
        content : msg.content,
        timestamp : msg.timestamp,
        type : "received",
        senderName : msg.senderId.fullname
      }
    }
  })
  return res.status(200).send(data)
})