import { useEffect } from 'react'
import { useState,useRef } from 'react'

const App = () => {
  const [message , setMessage] = useState(['hi there' , 'hello there','how are you all , good'])
  const [sentMsg , setSentmsg] = useState(['i am good ', 'hows your day'])

  const wsRef = useRef()
  const inputRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    wsRef.current = ws

    ws.onmessage = (event) => {    //message from server->client
      setMessage(m => [...m, event.data])
    }

    ws.onopen = () => {   // when websocket connectn has been established with the server ,  run this fn
    ws.send(JSON.stringify({
      type : "join",
      payload : {
        roomId : "red"
      }
    }))
    }
  },[])

  function clickHandler(){
    const msg = inputRef.current.value;
    setSentmsg([...sentMsg,msg])

    wsRef.current.send(JSON.stringify({
      type :'chat',
      payload: {
        message : msg
      }
    }))
  }

  return <>
    <div className=' border-2 h-screen bg-black  '>
        <div className='flex border-2 h-[90vh]'>
          <div className='LEFT w-1/2  border bg-black'>
            <div className='border-2  border-amber-500 m-7'>
              {message.map((e,i) => {
                return <div className='m-2 border flex  border-red-500'>
                    <span className='border-2 rounded bg-white  p-3 text-black' key={i}>{e}</span>
                </div>
              })}
            </div>

          </div>

          <div className='RIGHT w-1/2 bg-rose-500'>
              <div className='border-2  border-amber-500 m-7'>
                {sentMsg.map((e,i) => {
                  return <div className='m-2 border flex justify-end'>
                    <span className='border-2 rounded  bg-white  p-3 text-black' key={i}>{e}</span>
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

export default App

