import express from 'express'
import cookieParser from "cookie-parser"
import cors from 'cors'

import indexRouter from './routes/indexRouter.js'
import roomRouter from './routes/roomRouter.js'
import messageRouter from './routes/messageRouter.js'
import usersRouter from './routes/userRouter.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  // origin: "https://chat-frontend-ivory-eta.vercel.app",
  origin : true,
  credentials: true
}));

app.use('/', indexRouter)
app.use('/user' , usersRouter)
app.use('/room',roomRouter )
app.use('/msg', messageRouter)

export default app