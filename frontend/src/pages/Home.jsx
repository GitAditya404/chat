import React, { useState ,useContext, useRef, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.jsx'
import { RoomContext } from '../../context/RoomContext.jsx'

const Home = () => {
  const joinRef = useRef(null)
  const createRef = useRef(null)
  const [responseMsg , setResponseMsg] = useState("")
  const [title ,setTitle] = useState("")
  const [startTime ,setStartTime] = useState("")
  const [endTime ,setEndTime] = useState("")
  const [emails , setEmails] = useState([])
  const [showMeetingModal, setShowMeetingModal] = useState(false)

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

  async function meetingScheduler(){
    try{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/createMeeting`,
      {
        title : title,
        startTime,
        endTime,
        emails : emails.split(",").map(email => email.trim())

      },
      {withCredentials : true}
    )

    
      if(response.data.msg)
      {
        setResponseMsg(response.data.msg)
        setTimeout(() => {
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
          

          {/* Create metting Card */}
          <div className="relative bg-[#F5B246] text-black rounded-2xl border-[5px] border-black shadow-[8px_8px_0px_#111] p-6">

            <h1 className="text-2xl md:text-3xl font-extrabold text-center">
              Schedule Meeting
            </h1>

            <p className="text-center mt-3 font-semibold">
              Schedule with Google Calendar
            </p>

            <button
              onClick={() => setShowMeetingModal(true)}
              className="mt-6 w-full bg-[#D88AD8] border-4 border-black text-black text-lg font-bold py-3 rounded-xl shadow-[4px_4px_0px_#111] hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Schedule
            </button>
          </div>

          { showMeetingModal && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

              <div className="w-full max-w-xl bg-[#1E1B2E] text-white rounded-3xl border border-white/10 shadow-2xl p-6 relative animate-[fadeIn_.2s_ease]">

                {/* Close Button */}
                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white"
                >
                  ✕
                </button>

                <h1 className="text-3xl font-bold mb-2">
                  Schedule Meeting
                </h1>

                <p className="text-gray-400 mb-8">
                  Schedule with Google Calendar
                </p>

                <div className="mb-5">
                  <label className="block mb-2 text-sm text-gray-300">
                    Meeting Title
                  </label>

                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="Team Discussion"
                    className="w-full px-4 py-3 rounded-xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-sm text-gray-300">
                    Start Time
                  </label>

                  <input
                    onChange={(e) => setStartTime(e.target.value)}
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-sm text-gray-300">
                    End Time
                  </label>

                  <input
                    onChange={(e) => setEndTime(e.target.value)}
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <div className="mb-7">
                  <label className="block mb-2 text-sm text-gray-300">
                    Recipient Emails
                  </label>

                  <input
                    onChange={(e) => setEmails(e.target.value)}
                    type="text"
                    placeholder="abc@gmail.com, xyz@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <button
                  onClick={meetingScheduler}
                  className="w-full py-3 rounded-xl bg-[#7B61FF] hover:bg-[#6b50ff] transition-all text-lg font-semibold"
                >
                  Schedule Meeting
                </button>

              </div>
            </div>
          )
        }

        </div>
      </div>
    </div>
  </>
)
}

export default Home
