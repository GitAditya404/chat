import React from 'react'
import { useState, useRef ,useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Room = () => {
      // const [message , setMessage] = useState([{msg:'hi there', time:new Date()},{msg:'hello', time:new Date()}])
  const [message , setMessage] = useState([])
  const [sentMsg , setSentmsg] = useState([])
  
  const {id} = useParams();
  const wsRef = useRef()
  const inputRef = useRef(null)

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
      const value  = {"msg" : parsedMsg.msg , "time" : new Date(parsedMsg.time)} // b/c date has become string so changed it to new Date type
      setMessage(m => [...m,value])
    }

    return () => {
      setMessage([])
      setSentmsg([])
      ws.close()
    }

  },[id])

  function clickHandler(){
    const msg = inputRef.current.value;

    const newMsg = {"msg" : msg, "time" : new Date()}
    setSentmsg([...sentMsg,newMsg])

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
        <div className='flex border-2 h-[90vh]'>
          <div className='LEFT-RECEIVED w-1/2  border bg-black'>
            <div className='border-2  border-amber-500 m-7'>
              {message.map((e,i) => {
                return <div className='m-2 border flex  border-red-500'>
                 <div className='relative border-2 rounded bg-white p-2 text-black max-w-fit'>
                    <span className='pr-12'>{e.msg}</span>

                    <span className='absolute bottom-1 right-0 text-[12px] text-gray-500'>
                      {formatTime(e.time)}
                    </span>
                  </div>
                    
                </div>
              })}
            </div>

          </div>

          <div className='RIGHT-SENT w-1/2 bg-rose-500'>
              <div className='border-2  border-amber-500 m-7'>
                {sentMsg.map((e,i) => {
                  return <div className='m-2 border flex justify-end'>
                                     <div className='relative border-2 rounded bg-white p-2 text-black max-w-fit'>
                    <span className='pr-12'>{e.msg}</span>

                    <span className='absolute bottom-1 right-0 text-[12px] text-gray-500'>
                      {formatTime(e.time)}
                    </span>
                  </div>
                    </div>
                })}
              </div>

          </div>
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
