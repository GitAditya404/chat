app.get('/',isLoggedIn ,async (req,res) => {
    const rooms = await roomModel.find({members:req.user._id})
    res.send(rooms)
})

app.get('/me' , isLoggedIn , (req,res) => {
  res.status(200).send('user verified')
})

app.get('/health' , (req,res) => {
  res.status(200).json({
    status : "OK" , 
    time : new Date()
  })
})