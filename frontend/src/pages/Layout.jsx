import { useEffect,useContext } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import { RoomContext } from "../../context/RoomContext"

const Layout = () => {

    const {rooms} = useContext(RoomContext)

    return (
        <div className='flex w-full h-screen bg-black text-white'>
        
        {/* LEFT SIDE ALWAYS VISIBLE */}
        <Sidebar rooms={rooms} />

        {/* RIGHT SIDE CHANGES */}
        <div className='flex-1 border-l border-[#2c2d2d]'>
            <Outlet />
        </div>

        </div>
    )
}

export default Layout