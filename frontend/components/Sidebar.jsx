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

  function plusClick(){
    navigate('/')
  }


      return (
    <div className="SIDEBAR flex shrink-0 flex-col bg-[#2c3e50] w-full sm:w-[40vw] lg:w-[30vw] h-screen px-3 sm:px-5 py-4 sm:py-5 border-r border-[#2c2d2d] shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        
        <h1 className="text-white font-extrabold text-4xl tracking-wide">
          Connect
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={plusClick}
            className="w-10 h-10 rounded-full cursor-pointer border-gray-500 flex items-center justify-center hover:bg-[#2A2B2B] transition-all"
          >
            <img
              className="size-5 invert brightness-200"
              src="../public/add.png"
              alt="Add"
            />
          </button>

          <button
            onClick={profileClick}
            className="cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition-all"
          >
            Profile
          </button>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 mt-6 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-700">
        {rooms.length === 0 ? (
          <p className="text-gray-400 text-center mt-4 text-lg">
            No room joined
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => nameClickHandler(room._id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
              ${
                id === room._id
                  ? "bg-amber-500 text-black shadow-md"
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