import React from 'react'
import { useState, useRef ,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Room = () => {
      // const [message , setMessage] = useState([{content:'hi there', timestamp:new Date(),type : "received"},{content:'hello', timestamp:new Date(),type :"received"}])
  const [message , setMessage] = useState([])
  // const [sentMsg , setSentmsg] = useState([])
  
  const {id} = useParams();
  const wsRef = useRef()
  const inputRef = useRef(null)

  const fetchMsg = async () => {
    const resp = await axios.get('http://localhost:3000/msg',
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

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
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
      const value  = {"content" : parsedMsg.content , "timestamp" : new Date(parsedMsg.timestamp),"type" : "received"} // b/c date has become string so changed it to new Date type
      setMessage(m => [...m,value])
    }

    fetchMsg()

    return () => {
      setMessage([])
      ws.close()
    }

  },[id])

  async function clickHandler(){
    const msg = inputRef.current.value;

    const newMsg = {"content" : msg, "timestamp" : new Date(), "type" : "sent"}

    const resp = await axios.post('http://localhost:3000/msg/create',
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

  return <>
    <div className=' border-2 h-screen bg-black  '>
        <div className='border h-[90vh]'>

          <div className='w-full  border bg-gray-300'>
            <div className='border-2  border-amber-500 bg-blue-500 m-7'>
              {message.map((e,i) => {
                return <div className= {`m-2 flex border-red-500 ${e.type === "sent" ? "justify-end" : "justify-start"}`}>
                          <div className='relative border-2 bg-amber-500 rounded  p-2 text-black '>
                              <span className='pr-12'>{e.content}</span>

                              <span className='absolute bottom-1 right-0 text-[12px] text-gray-500'>
                                {formatTime(e.timestamp)}
                              </span>
                          </div>
                    
                    </div>
              })}
            </div>

          </div>

          {/* <div className='RIGHT-SENT w-1/2 bg-rose-500'>
              <div className='border-2  border-amber-500 m-7'>
                {sentMsg.map((e,i) => {
                  return <div className='m-2 border flex justify-end'>
                            <div className='relative border-2 rounded bg-white p-2 text-black max-w-fit'>
                    <span className='pr-12'>{e.content}</span>

                    <span className='absolute bottom-1 right-0 text-[12px] text-gray-500'>
                      {formatTime(e.timestamp)}
                    </span>
                  </div>
                    </div>
                })}
              </div>

          </div> */}
        </div>
        <div className='ml-96 mr-96 h-16 text-white'>
          <div className='flex mt-2  '>
            <input className='bg-white caret-black p-1 w-[40vw] text-gray-700 h-12' ref={inputRef} type="text" placeholder='Type your msg...' />
            <button onClick={clickHandler} className='border ml-5 rounded-xl bg-blue-500 w-24'>Send</button>
          </div>
        </div>

    </div>
  </>
}

export default Room
