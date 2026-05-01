import React, { useState ,useContext, useRef, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.jsx'
import { RoomContext } from '../../context/RoomContext.jsx'

const Home = () => {
  const joinRef = useRef(null)
  const createRef = useRef(null)
  const [responseMsg , setResponseMsg] = useState("")

  const {fetchData} = useContext(RoomContext)

  async function joinClick(){
    
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/room/join`,
        {
          name: joinRef.current.value
        },
        {withCredentials: true}
      )
      if(response.data.msg)
        {
          setResponseMsg(response.data.msg)
          await fetchData()

          setTimeout(() => {
            console.log("ran")
            setResponseMsg("")
          }, 4000);
      }

    }
    catch(err){
      setResponseMsg(err.response.data.msg)
      setTimeout(() => {
        setResponseMsg("")
      }, 4000);
    }

  }

  async function createClick(){
    try{
      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/room/create`,
        {
          name: createRef.current.value
        },
        {withCredentials: true}
      )

      if(resp.data.msg)
      {
        setResponseMsg(resp.data.msg)
        await fetchData()

        setTimeout(() => {
          console.log("ran")
          setResponseMsg("")
        }, 4000);
      }

    }

    catch(err){
      setResponseMsg(err.response.data.msg)

      setTimeout(() => {
          console.log("ran")
          setResponseMsg("")
      }, 4000);
    }

  }

  return (
  <>
    <div className="OUTER justify-center flex  min-h-screen text-white bg-[linear-gradient(to_right,#00000020_1px,transparent_1px),linear-gradient(to_bottom,#00000020_1px,transparent_1px)] bg-size-[80px_80px] bg-[#b8f1cb]">

      <div className="RIGHT  w-2/3 flex justify-center items-start overflow-y-auto">
        <div className="relative w-full max-w-4xl mt-10 space-y-12">

          {/* Response Message */}
          {responseMsg && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[80%] bg-[#D88AD8] text-black rounded-md border-4 border-black shadow-[6px_6px_0px_#111] px-6 py-4">
              <p className="text-center text-xl font-bold">{responseMsg}</p>
            </div>
          )}

          {/* Join Room Card */}
          <div className=" relative bg-[#F5B246] text-black rounded-md border-[6px] border-black shadow-[8px_8px_0px_#111] p-6">

            <span className="absolute top-3 left-4 text-2xl">✦</span>
            <span className="absolute top-3 right-4 text-2xl">✦</span>

            <h1 className="text-3xl font-extrabold text-center tracking-wide">
              JOIN ROOM!
            </h1>

            <p className="text-center text-lg font-semibold mt-2">
              Enter room name 😄
            </p>

            <input
              ref={joinRef}
              type="text"
              placeholder="Room Name"
              className="mt-6 w-full px-4 py-3 rounded-md border-4 border-black bg-white text-black outline-none text-base font-medium"
            />

            <button
              onClick={joinClick}
              className="mt-6 w-full bg-[#D88AD8] border-4 border-black text-black text-lg font-bold py-3 shadow-[4px_4px_0px_#111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
            >
              Let’s Go!
            </button>
          </div>

          {/* Create Room Card */}
          <div className="relative bg-[#F5B246] text-black rounded-md border-[6px] border-black shadow-[8px_8px_0px_#111] p-6">

            <span className="absolute top-3 left-4 text-2xl">✦</span>
            <span className="absolute top-3 right-4 text-2xl">✦</span>

            <h1 className="text-3xl font-extrabold text-center tracking-wide">
              CREATE ROOM!
            </h1>

            <p className="text-center text-lg font-semibold mt-2">
              Make your own space 🚀
            </p>

            <input
              ref={createRef}
              type="text"
              placeholder="Room Name"
              className="mt-6 w-full px-4 py-3 rounded-md border-4 border-black bg-white text-black outline-none text-base font-medium"
            />

            <button
              onClick={createClick}
              className="mt-6 w-full bg-[#D88AD8] border-4 border-black text-black text-lg font-bold py-3 shadow-[4px_4px_0px_#111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
            >
              Create Now!
            </button>
          </div>

        </div>
      </div>
    </div>
  </>
)
}

export default Home
