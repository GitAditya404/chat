import { createContext } from "react";
import axios from "axios";
import { useState } from "react";

export const RoomContext = createContext()

export function RoomsProvider({children}){

    const [rooms, setRooms] = useState([])

    async function fetchData(){
        const resp = await axios.get('https://chat-backend-9hug.onrender.com/',
            {
                withCredentials: true
            }
        )
        setRooms(resp.data);
    }

    return (
    <RoomContext.Provider value={{ rooms, fetchData }}>
      {children}
    </RoomContext.Provider>
  )
}
    

