import React from 'react'
import { useState, useRef ,useEffect,useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { RoomContext } from '../../context/RoomContext'

const Room = () => {
      // const [message , setMessage] = useState([{content:'hi there', timestamp:new Date(),type : "received"},{content:'hello', timestamp:new Date(),type :"received"}])
  const [message , setMessage] = useState([])

  const {id} = useParams();
  const wsRef = useRef()
  const inputRef = useRef(null)
  const lastMsgRef = useRef(null)
  const [isRoomCreator , setIsRoomCreator ] = useState(false)
  const navigate = useNavigate()

  const {rooms,fetchData} = useContext(RoomContext)

  const roomName = rooms.find((room) => room._id.toString() === id)?.name


  const fetchMsg = async () => {
    const resp = await axios.get('https://chat-backend-9hug.onrender.com/msg',
      {
        params : {roomId : id }, //data in get request is usually sent in params , also axios.get() only accepts 2 arguments ; so it is being sent like this
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
    const response = await axios.get('https://chat-backend-9hug.onrender.com/creator',
      {
        params : {roomId : id},
        withCredentials : true
      }
    )

      setIsRoomCreator(response.data)
  }

  async function deleteHandler(){
    try{
        await axios.post('https://chat-backend-9hug.onrender.com/room/delete',
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
      await axios.post('https://chat-backend-9hug.onrender.com/room/leave',
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

  useEffect(() => {
    const ws = new WebSocket('wss://chat-backend-9hug.onrender.com')
    wsRef.current = ws

    ws.onopen = () => {   // when websocket connectn has been established with the server , run this fn

      ws.send(JSON.stringify({
        type : "join",
        payload : {
          roomId : id
        }
      }))
    }


    ws.onmessage = (event) => {    //message from server->client
      const parsedMsg = JSON.parse(event.data);
      const value  = {"content" : parsedMsg.content , "timestamp" : new Date(parsedMsg.timestamp),"type" : "received" , "senderName" : parsedMsg.senderName} //changed date b/c date has become string so changed it to new Date type
      setMessage(m => [...m,value])
    }

    fetchMsg()
    checkCreator()
    
    return () => {
      setMessage([])
      console.log("cleanup ran")
      ws.close()
    }

  },[id])

  async function clickHandler(){
      const msg = inputRef.current.value;

      const newMsg = {"content" : msg, "timestamp" : new Date(), "type" : "sent" , "senderName" :"you"}

      const resp = await axios.post('https://chat-backend-9hug.onrender.com/msg/create',
        {
          roomId : id ,
          content : msg 
        },
        {withCredentials : true}
      )

      setMessage([...message,newMsg])

      wsRef.current.send(JSON.stringify({
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
    <div className="h-screen bg-[#0f172a] flex flex-col">

      {/* Header */}
      <div className="h-16  bg-[#1e293b] flex items-center px-6 shadow-md">
        <h1 className="text-white text-2xl font-semibold">{roomName}</h1>
        {
          isRoomCreator && <button onClick={deleteHandler} className='ml-auto rounded bg-blue-600 text-white p-2 cursor-pointer'>Delete Room</button>
        }
        {
          !isRoomCreator && <button onClick={leaveHandler} className='ml-auto rounded bg-blue-600 text-white p-2 cursor-pointer'>Leave Room</button>
        }
        
      </div>

      {/* Messages Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#111827]">
          <div className="max-w-4xl mx-auto space-y-3">

            {message.map((e, i) => {

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
            })}
          </div>
        </div>

      {/* Input Section */}
      <div className="h-20 bg-[#1e293b] flex items-center px-6">
        <div className="max-w-4xl mx-auto w-full flex gap-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 h-12 rounded-full px-5 outline-none bg-white text-black placeholder-gray-500"
          />
          <button
            onClick={clickHandler}
            className="bg-blue-500 hover:bg-blue-600 transition cursor-pointer px-6 rounded-full text-white font-medium"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  </>
)
}

export default Room
