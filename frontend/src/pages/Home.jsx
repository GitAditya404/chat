import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import {rooms,fetchData} from '../../customHooks/useRooms.jsx'

const Home = () => {
  const joinRef = useRef(null)
  const createRef = useRef(null)


  async function joinClick(){
    const resp = await axios.post('http://localhost:3000/room/join',
      {
        name: joinRef.current.value
      },
      {withCredentials: true}
    )
    console.log(resp.data)
    fetchData()
  }

  async function createClick(){
    const resp = await axios.post('http://localhost:3000/room/create',
      {
        name: createRef.current.value
      },
      {withCredentials: true}
    )
    console.log(resp.data)
    fetchData()
  }

  return (
    <>
    <div className='OUTER flex w-full text-white h-screen bg-black'>

          <Sidebar rooms={rooms}/>

        <div className='RIGHT border-l border-[#2c2d2d]  bg-[#161717]    w-2/3'>
              <div className='ml-52 mt-20'>
                  <div className='bg-[#2E2F2F] rounded-xl w-[40vw] h-60 border-2 text-white '>

                  <div className='text-center '>
                    <p className='text-4xl font-bold underline'>Join a Room</p>
                  </div>

                  <div className='ml-5 '>
                    <p className='text-xl text-red-500  mt-9'>Room Name :</p>
                    <input ref={joinRef} className='block mt-1 bg-white text-black rounded p-3' type="text" placeholder='name' />
                    <button onClick={joinClick} className=' mt-4 text-xl rounded bg-blue-600 text-white py-3 px-8' >Join</button>
                  </div>

                </div>

                <div className='bg-[#2E2F2F] mt-14 rounded-xl w-[40vw] h-60 border-2 text-white '>

                  <div className='text-center '>
                    <p className='text-4xl font-bold underline'>Create a Room</p>
                  </div>

                  <div className='ml-5 '>
                    <p className='text-xl text-red-500  mt-9'>Room Name :</p>
                    <input ref={createRef} className='block mt-1 bg-white text-black rounded p-3' type="text" placeholder='name' />
                    <button onClick={createClick} className=' mt-4 text-xl rounded bg-blue-600 text-white py-3 px-8' >Create</button>
                  </div>

                </div>
              </div>


        </div>
    </div>
    </>
  )
}

export default Home
