import { createContext, useContext, useEffect, useState } from "react";

export const WsContext = createContext() ;

export function WsProvider ({children}){
    const [ws , setWs]  = useState(null);

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_WS_URL)  //establish connectn

        socket.onopen = () => { // when websocket connectn has been established with the server , run this fn
            console.log("WebSocket connection is now ready")
        }
        setWs(socket)

        return () => {
            ws.close()
        }

    },[])


    return (
        <WsContext.Provider value={ws}>
            {children}
        </WsContext.Provider>
    )
}