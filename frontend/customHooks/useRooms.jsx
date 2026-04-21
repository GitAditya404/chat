import { useState,useEffect } from "react"
import axios from "axios"

const useRooms = () => {
    const [rooms ,setRooms] = useState([])
  
    async function fetchData(){
        const resp = await axios.get('http://localhost:3000/',
            {withCredentials: true}
        )
        setRooms(resp.data)
        console.log('fetch data ran')
    }

    return {rooms,fetchData}

}

export default useRooms