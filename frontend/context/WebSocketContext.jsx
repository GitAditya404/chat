import { createContext, useContext, useEffect, useRef, useState } from "react";

export const WsContext = createContext() ;

export function WsProvider ({children}){
    const wsRef = useRef(null)

    function connectWs(){
        const ws = wsRef.current

        // prevent multiple connections
        if (
            ws &&
            (ws.readyState === WebSocket.OPEN ||
            ws.readyState === WebSocket.CONNECTING)
            ) {
            return; // already active or connecting 
        }

        const socket = new WebSocket(import.meta.env.VITE_WS_URL)  //establish connectn

        socket.onopen = () => { // when websocket connectn has been established with the server , run this fn
                console.log("WebSocket connection is now ready")
        }

        wsRef.current = socket;

    }

    // below cleanup code is purely optional b/c above code will prevent mulltiple connections
    useEffect(() => {
    return () => {
        if (wsRef.current) {
        wsRef.current.close();
        }
    };
    }, []);


    return (
        <WsContext.Provider value={{wsRef,connectWs}}>
            {children}
        </WsContext.Provider>
    )
}