import React, { useContext } from 'react'
import { useState , useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { WsContext } from '../../context/WebSocketContext'

const Profile = () => {

  const [data , setData] = useState(null)
  const [responseMsg , setResponseMsg] = useState("")
  const navigate = useNavigate()
  const {wsRef} = useContext(WsContext)

  async function saveHandler(){

    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/profile/save`,
      {
        data : data
      },
      {withCredentials : true}
    )
    setResponseMsg(response.data.msg)

    setTimeout(() => {
      setResponseMsg("")
    }, 4000);
    }

    catch(err){
      setResponseMsg(err.response?.data.msg)

      setTimeout(() => {
        setResponseMsg("")
      }, 4000);
    }

  }

  async function logOut(){
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/user/logout`,
        {},
        {
          withCredentials : true
        }
      )
      wsRef.current.close();
      navigate('/login')
    }

    catch(err){
      setResponseMsg(err.response?.data.msg)

      setTimeout(() => {
        setResponseMsg("")
      }, 4000);
    }
  }

  async function fetchProfile(){
      try{
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`,
          {
            withCredentials : true
          }
        )
        setData(response.data)
        setTimeout(() => {
          setResponseMsg("")
        }, 4000);
      }

      catch(err){
        setResponseMsg(err.response?.data.msg)
        setTimeout(() => {
          setResponseMsg("")
        }, 4000);
      }

  }

  useEffect(() => {
    fetchProfile()
  },[])

  async function imgUploadHandler(e){
    const file = e.target.files[0]
    if(!file)
      return

    try{
      const formData = new FormData(); // create object of FormData type to upload file, b/c file upload needs -> FormData
      formData.append('profileImg',file)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/profile/pic`,
        formData,
      {
        withCredentials :true,
        headers : {
          "Content-Type" : "multipart/form-data"
        }
      }
    )
    setResponseMsg(response.data.msg)
    fetchProfile()
    }

    catch(err){
      
      setResponseMsg(err.response?.data.msg || "Upload Failed")
    }

  }

return (
    <div className="min-h-screen bg-[#0f172a]">

      {/* Top Abstract Banner */}
      <div
        className="h-60 bg-cover bg-center "
        style={{ backgroundImage: "url('/abstract_background.jpg')" }}
      >
        {responseMsg && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[80%] max-w-sm">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-md text-center font-medium">
              {responseMsg}
            </div>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="max-w-6xl  mx-auto relative -mt-28   flex gap-8 px-6">

        {/* Left Profile Card */}
      <div className="w-1/3 bg-[#40407a] rounded-3xl shadow-xl overflow-hidden h-fit">

          {/* Top section */}
          <div className="flex flex-col items-center px-8 py-10 ">
            <img
              src = {data?.profilePic || "/defaultImg.jpg"}
              alt=""
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <input 
              onChange={imgUploadHandler}
              type="file" 
              className="mt-2 ml-16 text-sm text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />

            <h2 className="mt-5 text-3xl font-bold text-white text-center">
              {data?.fullname || ""}
            </h2>

            <p className="text-white text-sm mt-1 break-all text-center">
              {data?.email || ""}
            </p>
          </div>

          {/* Bottom section */}
          <div className="px-8 py-8 space-y-6">

            <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                About
              </p>
              <p className="text-gray-700 mt-2 leading-relaxed wrap-break-word">
                {data?.about || "No description added"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Phone Number
              </p>
              <p className="text-gray-700 mt-2">
                {data?.phoneNo || "Not provided"}
              </p>
            </div>

          </div>
      </div>

        {/* Right Info Section */}
        <div className="w-2/3 bg-[#40407a] rounded-2xl shadow-lg p-10">
          <h1 className="text-3xl font-bold  mb-8">
            Profile Information
          </h1>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="text-white text-sm">Full Name</label>
              <input
                type="text"
                value={data?.fullname || ""}
                onChange={(e) => setData({...data ,fullname : e.target.value})}
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none bg-gray-50"
              />
            </div>

            <div>
              <label className="text-white text-sm">Email</label>
              <input
                type="text"
                value={data?.email || ""}
                readOnly
                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none bg-[#aaa69d]"
              />
            </div>

            <div>
              <label className="text-white text-sm">Phone Number</label>
              <input
                type="text"
                value= {data?.phoneNo  || ""}
                onChange={(e) => setData({...data ,phoneNo : e.target.value})}

                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none bg-gray-50"
              />
            </div>

            <div>
              <label className="text-white text-sm">About</label>
              <input  
                type="text"
                value={data?.about || ""}
                onChange={(e) => setData({...data ,about : e.target.value})}

                className="w-full mt-2 border rounded-lg px-4 py-3 outline-none bg-gray-50"
              />
            </div>

          </div>

          <div className='flex '>
          <button onClick={saveHandler} className="mt-8 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md">
            Save
          </button>
          <button onClick={logOut} className='ml-auto mt-8 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md'>Log Out</button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Profile
