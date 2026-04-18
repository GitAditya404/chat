import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react'

const Home = () => {
  const nameRef = useRef(null)

  const [rooms ,setRooms] = useState([])
  useEffect( () => {

    async function fetchData(){
      const resp = await axios.get('http://localhost:3000/',
        {withCredentials: true}
      )
      // console.log(resp.data)
      setRooms(resp.data)
    }
    fetchData();
  },[])

  async function joinClick(){
    const resp = await axios.post('http://localhost:3000/room/join',
      {
        name: nameRef.current.value
      },
      {withCredentials: true}
    )
    console.log(resp.data)
  }

  return (
    <>
    <div className='OUTER flex w-full text-white h-screen bg-black'>

        <div className='SIDEBAR flex flex-col  bg-[#161717] w-1/3 px-7 py-4'>

            <div className='flex  items-start'>
                <h1 className=' text-white font-bold  text-3xl'>Connect</h1>
                <button className=' ml-auto rounded bg-blue-600 text-white p-2'>Profile</button>
            </div>
            <div className='flex-1 mt-4 overflow-y-auto space-y-2'>
              {rooms.length === 0 ? (
                <p className='text-gray-400 text-center mt-4'>No room joined</p>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room._id}
                    className='flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1E1F1F] hover:bg-[#2A2B2B] cursor-pointer transition-all duration-200'
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

        <div className='RIGHT border-l border-[#2c2d2d] flex justify-center bg-[#161717] items-center   w-2/3'>

                <div className='bg-[#2E2F2F] rounded-xl w-[40vw] h-60 border-2 text-white '>

                  <div className='text-center '>
                    <p className='text-4xl font-bold underline'>Join a Room</p>
                  </div>

                  <div className='ml-5 '>
                    <p className='text-xl text-red-500  mt-9'>Room Name :</p>
                    <input ref={nameRef} className='block mt-1 bg-white text-black rounded p-3' type="text" placeholder='name' />
                    <button onClick={joinClick} className=' mt-4 text-xl rounded bg-blue-600 text-white py-3 px-8' >Join</button>
                  </div>

                </div>
        </div>
    </div>
    </>
  )
}

export default Home
