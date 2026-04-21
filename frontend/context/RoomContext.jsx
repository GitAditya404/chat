import { createContext } from "react";
import axios from "axios";
import { useState } from "react";

const RoomContext = createContext()

export function RoomsProvider({children}){
    const [rooms, setRooms] = useState([])

    async function fetchData(){
        const resp = await axios.get('http://localhost:3000/',
            {
                withCredentials: true
            }
        )
        setRooms(resp);
    }
      return (
    <RoomsContext.Provider value={{ rooms, fetchData }}>
      {children}
    </RoomsContext.Provider>
  );
};
    

