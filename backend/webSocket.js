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
                
                // Clean up any dead sockets before adding new one
                // only keeps sockets which are alive(where readyState)=== 1
                allSocket[roomId] = allSocket[roomId].filter(s => s.readyState === WebSocket.OPEN)
                    

                allSocket[roomId].push(socket);
                console.log('user joined ' + roomId)
                socket.room = roomId  //attaching a room field in socket itself , so that later the room of the socket can be identified instantly
                console.log(allSocket)
            }

            if(parsedMsg.type === 'leave')
            {
                const roomId = socket.room
                
                if(!allSocket[roomId]) return; // if room already deleted from room router delete endpoint  

                allSocket[roomId] = allSocket[roomId].filter(x => x !== socket)
               

                if (allSocket[roomId].length === 0) { // if no one in room then delete the room also
                    delete allSocket[roomId]; 
                }
                console.log('user left ' + roomId)
                console.log(allSocket)

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

                    //  SAFETY CHECK
                if (!roomId || !allSocket[roomId]) {
                    console.log("No room found for peerId");
                    return;
                }

                const clients = allSocket[roomId]

                //Broadcast(send) peerId to frontend 

                    // Send existing users' peerIds to new user
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

                        // Send new user's peerId to others
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

        socket.on('close',(code , reason) => {
            // disconnect the websocket connection of socket from which close was initiated

            console.log("close running — code:", code, "reason:", reason.toString(), "room:", socket.room)
            const roomId = socket.room;

            if (!roomId || !allSocket[roomId]) return;

            // remove closed socket
            allSocket[roomId] = allSocket[roomId].filter(
                (s) => s !== socket
            );

            // delete empty room
            if (allSocket[roomId].length === 0) {
                delete allSocket[roomId];
            }
            console.log(allSocket)
        })

        socket.on('error', (err) => {
          console.log("socket error:", err.message, "room:", socket.room)
        })

})

}

