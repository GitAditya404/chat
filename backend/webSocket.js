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
                console.log('user joined ' + roomId)
                socket.room = roomId  //attaching a room field in socket itself , so that later the room of the socket can be identified instantly
                // console.log(allSocket)
            }

            if(parsedMsg.type === 'leave')
            {
                const roomId = socket.room
                if(allSocket[roomId]){
                    allSocket[roomId] = allSocket[roomId].filter(x => x !== socket)
                }

                if (allSocket[roomId].length === 0) { // if no one in room then delete the room also
                    delete allSocket[roomId]; 
                }
                console.log('user left ' + roomId)
                // console.log(allSocket)

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
                    type : 'chat',
                    payload : {
                        content: parsedMsg.payload.msg,
                        senderName : user.fullname,
                        timestamp : new Date()
                    }
                }

                clients.forEach((c) => {
                    if(c!=socket){
                        c.send(JSON.stringify(msgWithTime))}

                })   
            }

            if(parsedMsg.type === "peerId")
            {   
                // attach peerId in socket like u attached room in socket 
                //socket = {
                    // room: "room123",
                    // peerId: "abc123"
                    // }
                socket.peerId = parsedMsg.payload.peerId

                const roomId = socket.room;
                const clients = allSocket[roomId]

                //Broadcast(send) peerId to frontend 

                    // 🔹 1. Send existing users' peerIds to new user
                    clients.forEach((c) => {
                        if (c !== socket && c.peerId) {
                            socket.send(JSON.stringify({
                                type: "peerId",
                                payload: {
                                    peerId: c.peerId
                                }
                            }));
                        }
                    });

                        // 🔹 2. Send new user's peerId to others
                    clients.forEach((c) => {
                        if (c !== socket) {
                            c.send(JSON.stringify({
                                type: "peerId",
                                payload: {
                                    peerId: socket.peerId
                                }
                            }));
                        }
                    });
            }

        })
        socket.on('close',() => {
            // disconnect the websocket connection of socket from which close was initiated
          console.log("close running")
            // console.log(allSocket)
        })

})

}

