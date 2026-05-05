import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "axios"
import {WsContext} from '../context/WebSocketContext.jsx'

const ProtectedRoute = ({children}) => {
    
    const {connectWs} = useContext(WsContext)
    const [isAuth, setIsAuth] = useState(null)
    // console.log("render")

    useEffect(() => {
        // console.log('mounted')
        async function checkAuth (){
            try{
                await axios.get(`${import.meta.env.VITE_API_URL}/me`,
                    {withCredentials: true}
                )

                setIsAuth(true)
                connectWs()  //start websocket connectn only when user is loggedIn 
                    
            }
            catch(e){
                setIsAuth(false)
            }
        }

        checkAuth()

    },[])

    if(isAuth === null) 
        return <div>Loading...</div>
    if(!isAuth) 
        return <Navigate to="/login"/>

    return children
}

export default ProtectedRoute