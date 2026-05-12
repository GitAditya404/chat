import { useState } from "react"
import { useNavigate,useParams  } from "react-router-dom"

const Sidebar = ({rooms}) => {

  const navigate = useNavigate()
  const {id} = useParams()

  function nameClickHandler(roomId){
      navigate(`/room/${roomId}`)
  }

  function profileClick(){
     navigate('/profile')
  }

  function homeClick(){
    navigate('/')
  }


    return (
    <div className="SIDEBAR flex shrink-0 flex-col bg-[#0f172a] w-full sm:w-[40vw] lg:w-[23vw] h-screen px-3 sm:px-5 py-4 sm:py-5 border-r border-[#2c2d2d] shadow-xl"
    
      style={{
        background:
          "radial-gradient(circle at top left, rgba(98,0,255,0.25), transparent 30%), #0B1020",
      }}
    >

      {/* Header */}
      <div className="flex  items-center gap-3 mb-8">
        
        <img src="https://res.cloudinary.com/dwrbwds1e/image/upload/v1778581762/logo2_w9m7ji.png" className="w-10 h-10 " alt="" />
        <h1 className="text-white font-semibold  text-4xl ">
          Connect
        </h1>

      </div>

      <button
            onClick={homeClick}
            className="cursor-pointer  w-60 text-lg flex items-center justify-center  transition-all rounded-2xl bg-[#7c3aed] hover:bg-[#8b5cf6] text-white py-3 font-medium "
          >
            <img
              className="size-4 invert brightness-200 "
              src="https://res.cloudinary.com/dwrbwds1e/image/upload/v1778581866/home_bayzjq.png"
              alt="Add"
            />
            <span className="ml-2">Home</span>
      </button>

      <button
            onClick={profileClick}
            className="cursor-pointer mt-5 w-60 text-lg flex items-center justify-center  transition-all rounded-2xl bg-[#1e293b] hover:bg-[#8b5cf6] text-white py-3 font-medium"
          >
            <img src="https://res.cloudinary.com/dwrbwds1e/image/upload/v1778581854/user_okosn3.png" className="size-4 invert brightness-200" alt="" />
            <span className="ml-2">Profile</span>
      </button>
  

      {/* Room List */}
      <div className="flex-1 mt-5 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-700">
        <p className="text-gray-400">Rooms</p>
        {rooms.length === 0 ? (
          <p className="text-gray-400 text-center mt-4 text-lg">
            No room joined
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => nameClickHandler(room._id)}
              className={`flex items-center  gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
              ${
                id === room._id
                  ? "bg-[#696a6c] text-white"
                  : "bg-[#1E1F1F] hover:bg-[#2A2B2B] text-white"
              }`}
            >
              {/* Avatar */}
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                {room.name.charAt(0).toUpperCase()}
              </div>

              {/* Room Name */}
              <div className="truncate">
                <h1 className="text-lg font-semibold truncate">
                  {room.name}
                </h1>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Sidebar