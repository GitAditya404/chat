import { useEffect } from "react"
import useRooms from "../../customHooks/useRooms"
import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"

const Layout = () => {

    const { rooms, fetchData } = useRooms()

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className='flex w-full h-screen bg-black text-white'>
        
        {/* LEFT SIDE ALWAYS VISIBLE */}
        <Sidebar rooms={rooms} />

        {/* RIGHT SIDE CHANGES */}
        <div className='w-2/3 border-l border-[#2c2d2d]'>
            <Outlet />
        </div>

        </div>
    )
}

export default Layout