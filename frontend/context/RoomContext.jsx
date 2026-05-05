import { createContext } from "react";
import axios from "axios";
import { useState } from "react";

export const RoomContext = createContext()

export function RoomsProvider({children}){

    const [rooms, setRooms] = useState([])

    async function fetchData(){
        const resp = await axios.get(`${import.meta.env.VITE_API_URL}/room/all`,
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
    

