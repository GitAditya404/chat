import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "axios"
const ProtectedRoute = ({children}) => {
    const [isAuth, setIsAuth] = useState(null)

    useEffect(() => {
        async function checkAuth (){
            try{
                await axios.get('https://chat-backend-9hug.onrender.com/me',
                    {withCredentials: true}
                )
                setIsAuth(true)
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