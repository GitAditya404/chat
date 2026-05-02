import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import db from './config/db.js'
import http from 'http'

import {webSocket} from './webSocket.js'
const server = http.createServer(app)
webSocket(server)

// app.listen(process.env.PORT || 3000)
server.listen(process.env.PORT || 3000, () => {
  console.log("server running");
});