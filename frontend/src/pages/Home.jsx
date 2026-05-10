import React, { useState ,useContext, useRef } from 'react'
import axios from 'axios'
import { RoomContext } from '../../context/RoomContext.jsx'

const Home = () => {
  const joinRef = useRef(null)
  const createRef = useRef(null)
  const [responseMsg , setResponseMsg] = useState("")
  const [title ,setTitle] = useState("")
  const [startTime ,setStartTime] = useState("")
  const [endTime ,setEndTime] = useState("")
  const [emails , setEmails] = useState("")
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
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
    <div className="OUTER justify-center bg-cover flex h-screen text-white bg-[#0f172a]"
     style={{ backgroundImage: "url('/11.png')" }}
     >

      <div className="RIGHT relative  w-full lg:w-2/3 flex justify-center items-start overflow-y-auto px-4">
        
        <div className=" w-full max-w-5xl mt-10 pb-10">

          {/* Response Message */}
          {responseMsg && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-[90%] md:w-125 bg-[#D88AD8] text-black rounded-2xl border-4 border-black shadow-[6px_6px_0px_#111] px-6 py-4">
              <p className="text-center text-lg md:text-xl font-bold">
                {responseMsg}
              </p>
            </div>
          )}

          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-7">

            {/* JOIN ROOM CARD */}
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">

            {/* Top */}
            <div className="flex items-center gap-4 mb-10">

              <img
                 src="https://res.cloudinary.com/dwrbwds1e/image/upload/v1778415853/meeting_wfdrnz.png"
                alt="video icon"
                className="w-14 h-14 object-contain invert brightness-200"
              />

              <h1 className="text-3xl font-semibold text-white">
                Join Room
              </h1>

            </div>

            {/* Text */}
            <p className="text-gray-300 text-lg mb-8">
              Join room by roomID
            </p>

            {/* Divider */}
            <div className="border-t border-white/10 mb-6"></div>

            {/* Button */}
            <div className="flex justify-end">

              <button
                onClick={() => setShowJoinModal(true)}
                className="px-10 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold shadow-lg cursor-pointer"
              >
                Join
              </button>

            </div>

          </div>

            {/* CREATE ROOM CARD */}
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">

            {/* Top */}
            <div className="flex items-center gap-4 mb-10">

              <img
                src="https://cdn-icons-png.flaticon.com/512/3659/3659899.png"
                alt="video icon"
                className="w-14 h-14 object-contain"
              />

              <h1 className="text-3xl font-semibold text-white">
                Create Room
              </h1>

            </div>

            {/* Text */}
            <p className="text-gray-300 text-lg mb-8">
              Create your own space
            </p>

            {/* Divider */}
            <div className="border-t border-white/10 mb-6"></div>

            {/* Button */}
            <div className="flex justify-end">

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-10 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold shadow-lg cursor-pointer"
              >
                Create
              </button>

            </div>

          </div>
          </div>

          {/* SCHEDULE Meeting CARD */}
          <div className="relative rounded-3xl mt-8 bg-white/10 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">

            {/* Top */}
            <div className="flex items-center gap-4 mb-10">

              <img
                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                alt="calendar icon"
                className="w-14 h-14 object-contain invert brightness-200"
              />

              <h1 className="text-3xl font-semibold text-white">
                Schedule Meeting
              </h1>

            </div>

            {/* Text */}
            <p className="text-gray-300 text-lg mb-8">
              Schedule meetings with Google Calendar
            </p>

            {/* Divider */}
            <div className="border-t border-white/10 mb-6"></div>

            {/* Button */}
            <div className="flex justify-end">

              <button
              onClick={() => setShowMeetingModal(true)}
                className="px-10 py-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-all duration-300 text-white font-semibold shadow-lg cursor-pointer"
              >
                Schedule
              </button>

            </div>

          </div>

          {/* JOIN ROOM MODAL */}
          {showJoinModal && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

              <div className="relative w-full max-w-md bg-[#1E1B2E] text-white rounded-3xl border border-white/10 shadow-2xl p-6">

                <button
                  onClick={() => setShowJoinModal(false)}
                  className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  ×
                </button>

                <h1 className="text-4xl font-bold mb-2">
                  Join Room
                </h1>

                <p className="text-gray-400 mb-8">
                  Enter the room ID to join
                </p>

                <div className="mb-7">

                  <label className="block mb-2 text-sm text-gray-300">
                    Room ID
                  </label>

                  <input
                    ref={joinRef}
                    type="text"
                    placeholder="Enter room ID"
                    className="w-full px-4 py-4 rounded-2xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />

                </div>

                <button
                  onClick={joinClick}
                  className="w-full py-4 rounded-2xl bg-[#7B61FF] hover:bg-[#6b50ff] transition-all text-lg font-semibold cursor-pointer"
                >
                  Join Room
                </button>

              </div>

            </div>
          )}

          {/* CREATE ROOM MODAL */}
          {showCreateModal && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

              <div className="relative w-full max-w-md bg-[#1E1B2E] text-white rounded-3xl border border-white/10 shadow-2xl p-6">

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  ×
                </button>

                <h1 className="text-4xl font-bold mb-2">
                  Create Room
                </h1>

                <p className="text-gray-400 mb-8">
                  Create your own room
                </p>

                <div className="mb-7">

                  <label className="block mb-2 text-sm text-gray-300">
                    Room Name
                  </label>

                  <input
                    ref={createRef}
                    type="text"
                    placeholder="Enter room name"
                    className="w-full px-4 py-4 rounded-2xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />

                </div>

                <button
                  onClick={createClick}
                  className="w-full py-4 rounded-2xl bg-[#7B61FF] hover:bg-[#6b50ff] transition-all text-lg font-semibold cursor-pointer"
                >
                  Create Room
                </button>

              </div>

            </div>
          )}

          {/* MEETING MODAL */}
          {showMeetingModal && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

              <div className="relative w-full max-w-xl bg-[#1E1B2E] text-white rounded-3xl border border-white/10 shadow-2xl p-6">

                <button
                  onClick={() => setShowMeetingModal(false)}
                  className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  ×
                </button>

                <h1 className="text-4xl font-bold mb-2">
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
                    className="w-full px-4 py-4 rounded-2xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-sm text-gray-300">
                    Start Time
                  </label>

                  <input
                    onChange={(e) => setStartTime(e.target.value)}
                    type="datetime-local"
                    className="w-full px-4 py-4 rounded-2xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <div className="mb-5">
                  <label className="block mb-2 text-sm text-gray-300">
                    End Time
                  </label>

                  <input
                    onChange={(e) => setEndTime(e.target.value)}
                    type="datetime-local"
                    className="w-full px-4 py-4 rounded-2xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
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
                    className="w-full px-4 py-4 rounded-2xl bg-[#2B2740] border border-[#3C3657] outline-none focus:border-[#7B61FF]"
                  />
                </div>

                <button
                  onClick={meetingScheduler}
                  className="w-full py-4 rounded-2xl bg-[#7B61FF] hover:bg-[#6b50ff] transition-all text-lg font-semibold cursor-pointer"
                >
                  Schedule Meeting
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  </>
)
}

export default Home
