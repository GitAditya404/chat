import { WebSocketServer } from "ws"
import verifyUser from './utils/verifyUser.js'
                                //WEBSOCKET SERVER
                                
export  let allSocket = {}
export const webSocket = (server) => {

    // const wss = new WebSocketServer({port:8080})  
    const wss = new WebSocketServer({ server });  // attaching websocket to same http server instead of running separate server on port 8080


    wss.on("connection" , (socket ,req) => {  //whenever there is a connectn to this webSocketServer call this fn and give it a socket
        console.log('user Connected')

        socket.on("message" , async (msg) => {
            const parsedMsg = JSON.parse(msg)  // since msg that is coming is string u need to conver it to obj


            if(parsedMsg.type === 'join')
            {
                const roomId = parsedMsg.payload.roomId;
                if(!allSocket[roomId]){  // if room not present in allSocket ,create it
                    allSocket[roomId] = [];
                }

                allSocket[roomId].push(socket);
                console.log('user joined' + roomId)
                socket.room = roomId  //attaching a room field in socket itself , so that later the room of the socket can be identified instantly
            }

            if(parsedMsg.type === 'chat')
            {
                // const token = req.cookies.token //this wont work here b/c this req does not pass through express cookie parser 
                const cookies  = req.headers.cookie  // o/p -> token=abc123; theme=dark
                const token = cookies?.split('; ')
                              .find(row => row.startsWith('token='))
                              ?.split('=')[1];

                const user = await verifyUser(token)

                const roomId = socket.room;
                if(!roomId) // check if socket has a room 
                    return console.log('user not in any room' + roomId)
                
                const clients = allSocket[roomId]

                const msgWithTime = {
                    content: parsedMsg.payload.msg,
                    senderName : user.fullname,
                    timestamp : new Date()
                }

                clients.forEach((c) => {
                    if(c!=socket){
                        c.send(JSON.stringify(msgWithTime))
                    }
                })   
            }
        })
        socket.on('close',() => {
          const roomId = socket.room
          if(allSocket[roomId]){
              allSocket[roomId] = allSocket[roomId].filter(x => x !== socket)
            }
        })

})

}

