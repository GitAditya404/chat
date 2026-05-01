import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "axios"
const ProtectedRoute = ({children}) => {
    const [isAuth, setIsAuth] = useState(null)

    useEffect(() => {
        async function checkAuth (){
            try{
                await axios.get(`${import.meta.env.VITE_API_URL}/me`,
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