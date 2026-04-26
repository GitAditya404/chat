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
        <>
        <div className='SIDEBAR flex flex-col  bg-[#161717] w-1/3 px-7 py-4'>

            <div className='flex  items-start'>
                <h1 className=' text-white font-bold  text-3xl'>Connect</h1>
                <button onClick={plusClick} >
                    <img  className="size-7 mt-2 invert brightness-200 cursor-pointer ml-[14vw] " src="../public/add.png" alt="" />
                </button>

                <button onClick={profileClick} className=' cursor-pointer ml-auto rounded bg-blue-600 text-white p-2'>Profile</button>
            </div>
            <div className='flex-1 mt-4 overflow-y-auto space-y-2'>
              {rooms.length === 0 ? (
                <p className='text-gray-400 text-center mt-4'>No room joined</p>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => nameClickHandler(room._id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1E1F1F] hover:bg-[#2A2B2B] cursor-pointer transition-all duration-200 ${id ===room._id ? 'bg-amber-500 hover:bg-amber-500' : 'bg-[#1E1F1F]'}`}
                  >
                  
                    <div className='w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold'>
                      {room.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h1 className='text-lg font-semibold'>{room.name}</h1>
                    </div>
                  </div>
                ))
              )}
            </div>

        </div>
        </>
    )
}

export default Sidebar