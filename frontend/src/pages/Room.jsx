import React from 'react'
import { useState, useRef ,useEffect,useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RoomContext } from '../../context/RoomContext'
import { WsContext } from '../../context/WebSocketContext'
import Peer from 'peerjs'

const Room = () => {
      // const [message , setMessage] = useState([{content:'hi there', timestamp:new Date(),type : "received"},{content:'hello', timestamp:new Date(),type :"received"}])
  const [message , setMessage] = useState([])

  const {id} = useParams();
  const inputRef = useRef(null)
  const lastMsgRef = useRef(null)
  const [isRoomCreator , setIsRoomCreator ] = useState(false)
  const navigate = useNavigate()

  const {rooms,fetchData} = useContext(RoomContext)
  const {wsRef} = useContext(WsContext)
  const peerRef = useRef(null)
  const [remotePeerId , setRemotePeerId] = useState(null)

  const [isCalling, setIsCalling] = useState(false)
  const myVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const streamRef = useRef(null)
  const [muteMic , setMuteMic] = useState(false)
  const [muteVideo, seteMuteVideo] = useState(false)

  const roomName = rooms.find((room) => room._id.toString() === id)?.name

  useEffect(() => {

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "join",
        payload: { roomId: id }
      }))
    }

    if(wsRef.current){
      wsRef.current.onmessage = (event) => {    //message from server->client
        const parsedMsg = JSON.parse(event.data);

        if(parsedMsg.type === 'peerId')
          setRemotePeerId(parsedMsg.payload.peerId)

        if(parsedMsg.type === 'chat'){

          const value  = {"content" : parsedMsg.payload.content , "timestamp" : new Date(parsedMsg.payload.timestamp),"type" : "received" , "senderName" : parsedMsg.payload.senderName} //changed date b/c date has become string so changed it to new Date type
          setMessage(m => [...m,value])
        }

      }
    }


    fetchMsg()
    checkCreator()
    
    return () => {
      setMessage([])

      wsRef.current.send(JSON.stringify(
      {
        type : "leave"
      }
    ))
    
    }

  },[id])


  useEffect(() => {
    const peer = new Peer()  // this connects to peerjs singnaling server,
    // genarates unique peerid , internally configures google stun server , keeps connection alive

    peer.on("open", (id) => { // this runs when connectn to peerJs server is successful
      console.log("My peer id " , id);

      //sharing ids using websocket
      wsRef.current?.send(JSON.stringify({
        type : "peerId",
        payload : {
          peerId : id
        }
      }))

    })

    peerRef.current = peer ;

    //listen for incoming call 
    peer.on("call", (call) => {
        call.answer(streamRef.current) // send my stream

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
        })
    })

  },[])

  const fetchMsg = async () => {
    const resp = await axios.get(`${import.meta.env.VITE_API_URL}/msg/all`,
      {
        params : {roomId : id }, //data in get request is sent in params , also axios.get() only accepts 2 arguments ; so it is being sent like this
        withCredentials : true
      }
    )
    let data = resp.data.map((msg) => {
      return {...msg,timestamp : new Date(msg.timestamp)}   //when data comes from backend ,json converts timestamp from new Date to string so change it back, so FormatTime can work on it 
    })

    data  = data.sort((a,b) => a.timestamp - b.timestamp)
    setMessage(data)

  }


  async function checkCreator (){
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/room/creator`,
      {
        params : {roomId : id},
        withCredentials : true
      }
    )

      setIsRoomCreator(response.data)
  }

  // async function fetchStatus(){
  //   const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`,
  //     {
  //       params : {roomId : id},
  //       withCredentials : true
  //     }
  //   )


  // }

  async function deleteHandler(){
    try{
        await axios.post(`${import.meta.env.VITE_API_URL}/room/delete`,
          {
            roomId : id
          },
          {withCredentials : true}
        )
        fetchData()
        navigate('/')
    }

    catch(err){
      alert(err.response?.data?.msg || "Something went wrong")
    }

  }

  async function leaveHandler(){

    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/room/leave`,
        {
          roomId : id
        },
        {withCredentials : true}
      )
      fetchData()
      navigate('/')
    }
    catch(err){
      alert(err.response?.data?.msg || "Something went wrong") 
    }

  }

  async function clickHandler(){
      const msg = inputRef.current.value;

      const newMsg = {"content" : msg, "timestamp" : new Date(), "type" : "sent" , "senderName" :"you"}

      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/msg/create`,
        {
          roomId : id ,
          content : msg 
        },
        {withCredentials : true}
      )

      setMessage([...message,newMsg])

      wsRef.current?.send(JSON.stringify({
        type :'chat',
        payload: {
          msg : msg
        }
      }))
  }

  function formatTime(date){
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

  function formatDate(date) {
      return date.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
  }

  async function startCall() {
      setIsCalling(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      streamRef.current = stream

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream
      }

      // If someone already exists → call them
      if (remotePeerId) {
        const call = peerRef.current.call(remotePeerId, stream)

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
          }
        })
      }
  }

  function endCall() {
    setIsCalling(false)

    streamRef.current?.getTracks().forEach(track => track.stop())

    if (myVideoRef.current) 
      myVideoRef.current.srcObject = null
    if (remoteVideoRef.current)
      remoteVideoRef.current.srcObject = null
  }

  function micToggle(){
    const audioTrack = streamRef.current?.getAudioTracks()[0]
    if (!audioTrack) return

    audioTrack.enabled = !audioTrack.enabled
    setMuteMic(!audioTrack.enabled)
  }

  function videoToggle(){
    const videoTrack = streamRef.current?.getVideoTracks()[0]
    if (!videoTrack) return

    videoTrack.enabled = !videoTrack.enabled
    seteMuteVideo(!videoTrack.enabled)
  }

  // const scrollHandler = (id) => {
  //   document.getElementById(id).scrollIntoView({
  //     behavior : 'smooth'
  //   })
  // }
  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({
      behavior : 'smooth'
    })
  }, [message])
  
  return (
  <>
    <div className="h-screen bg-[#090F21] flex flex-col">

      {/* Header */}
      <div className="h-16  bg-[#1e293b] flex items-center px-6 shadow-md">
        <h1 className="text-white text-2xl font-semibold">{roomName}</h1>
        <div className='ml-auto flex items-center gap-5'>
          <button onClick={startCall} className='mr-5'>
            <img className='size-8 invert brightness-200' src="/videoCall.png" alt="" />
          </button>
          {
            isRoomCreator && <button onClick={deleteHandler} className='ml-auto rounded bg-blue-600 text-white p-2 cursor-pointer'>Delete Room</button>
          }
          {
            !isRoomCreator && <button onClick={leaveHandler} className='ml-auto rounded bg-blue-600 text-white p-2 cursor-pointer'>Leave Room</button>
          }
        </div>

        
      </div>

      {/* Messages Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#111827]">
          <div className="max-w-4xl mx-auto space-y-3">
        {message.length ===0 ? (
                <div className="flex justify-center items-center h-full">
                    <h1 className="text-gray-400 text-lg md:text-xl font-medium bg-[#1f2937] px-6 py-3 rounded-xl shadow">
                      No Messages Yet
                    </h1>
                  </div>
              ):(
            message.map((e, i) => {

              let renderName = false;
              const prevSender = i > 0 ? message[i - 1].senderName : null;

              if (prevSender !== e.senderName && e.type !== "sent")
                renderName = true;

              let renderDate = false;
              const prevDate = i > 0 ? formatDate(message[i - 1].timestamp) : null;
              const currentDate = formatDate(e.timestamp);

              if (prevDate !== currentDate)
                renderDate = true;

              return (
                <React.Fragment key={i}>
                  {renderDate && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-700 text-gray-200 text-xs px-4 py-1 rounded-full shadow">
                        {currentDate}
                      </span>
                    </div>
                  )}

                  <div
                    ref={i === message.length-1 ? lastMsgRef : null} //if last msg attach  // ref

                    className={`flex ${
                      e.type === "sent" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col">
                      {renderName && (
                        <span className="text-xs text-gray-400 mb-1 ml-2">
                          {e.senderName}
                        </span>
                      )}

                      <div
                        className={`relative rounded-2xl px-4 py-2 max-w-xs md:max-w-md shadow-md ${
                          e.type === "sent"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        <span className="pr-14 wrap-break-word">{e.content}</span>

                        <span
                          className={`absolute bottom-1 right-2 text-[10px] ${
                            e.type === "sent"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(e.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
              ) }

          </div>
        </div>

      {/* Input Section */}
      <div className="h-20 bg-[#1e293b] flex items-center px-6">
        <div className="max-w-4xl mx-auto w-full flex gap-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 h-12 rounded-lg px-5 outline-none bg-[#101528]  placeholder-gray-500 text-white"
          />
          <button
            onClick={clickHandler}
            className="bg-blue-600 hover:bg-blue-900 transition cursor-pointer px-5 rounded-full text-white font-medium"
          >
            <img src="https://res.cloudinary.com/dwrbwds1e/image/upload/v1778601677/paper-plane_bekhdo.png"  className='size-6 invert brightness-200' alt="" />
          </button>
        </div>
      </div>

    </div>

    {/* videoCall Section */}
    {isCalling && (
      <div className="fixed inset-0 bg-[#020617] flex flex-col z-50">

        {/* Top bar */}
        <div className="  px-6 py-4 bg-[#0f172a] shadow-md">
          <h2 className="text-white text-lg font-semibold">
            Video Call
          </h2>

        </div>

        {/* Video Grid */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 justify-center items-center">

          {/* My Video (Floating on mobile, side on desktop) */}
          <div className="relative w-full h-[40vh] md:w-1/3 md:h-[60vh] bg-black rounded-2xl overflow-hidden shadow-lg">
            <video
              ref={myVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
              You
            </span>
          </div>

          {/* Remote Video (Main) */}
          <div className="relative border w-full h-[40vh] md:w-1/3 md:h-[60vh] bg-black rounded-2xl overflow-hidden shadow-lg">
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 text-white text-sm bg-black/50 px-3 py-1 rounded">
              Remote User
            </span>
          </div>


        </div>

        {/* Controls */}
        <div className="bg-[#0f172a] p-4 flex justify-center items-center gap-6">

          {/* Mic */}
          <button
            onClick={micToggle}
            className={`p-4 rounded-full transition ${
              muteMic ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <img
              className="w-6 h-6 invert"
              src={
                muteMic
                  ? "https://res.cloudinary.com/dwrbwds1e/image/upload/v1778064901/noMic_phbi3e.png"
                  : "https://res.cloudinary.com/dwrbwds1e/image/upload/v1778064900/mic_ywshsj.png"
              }
              alt=""
            />
          </button>

          {/* Video */}
          <button
            onClick={videoToggle}
            className={`p-4 rounded-full transition ${
              muteVideo ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <img
              className="w-6 h-6 invert"
              src={
                muteVideo
                  ? "https://res.cloudinary.com/dwrbwds1e/image/upload/v1778064881/noVideo_trqyhy.png"
                  : "https://res.cloudinary.com/dwrbwds1e/image/upload/v1778063889/videoCall_pykb69.png"
              }
              alt=""
            />
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-white font-semibold shadow-lg"
          >
            End
          </button>
        </div>
      </div>
    )}
  </>
)
}

export default Room
