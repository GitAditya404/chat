import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react'

const Home = () => {
  const nameRef = useRef(null)

  const [rooms ,setRooms] = useState(null)
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

        <div className='SIDEBAR flex flex-col border w-1/3 px-7 py-2'>

            <div className='flex border items-start'>
                <h1 className='border text-white font-bold  text-3xl'>Connect</h1>
                <button className='border ml-auto rounded bg-blue-600 text-white p-2'>Profile</button>
            </div>
            <div className='border flex-1 bg-red-600 '>
               {/* { rooms.map((room) => {
                    <h1>room</h1>
                })}     */}
            </div>

        </div>

        <div className='RIGHT flex justify-center items-center border  w-2/3'>
                <div className='rounded-xl w-[40vw] h-60 border-2 text-white '>

                  <div className='text-center '>
                    <p className='text-4xl font-bold'>Join a Room</p>
                  </div>

                  <div className='ml-5'>
                    <p className='text-xl mt-9'>Room Name</p>
                    <input ref={nameRef} className='block mt-1 bg-white text-black rounded p-3' type="text" placeholder='name' />
                    <button onClick={joinClick} className='border mt-4 text-xl rounded bg-blue-600 text-white py-3 px-8' >Join</button>
                  </div>

                </div>
        </div>
    </div>
    </>
  )
}

export default Home
