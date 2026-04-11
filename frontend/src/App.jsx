import { useEffect } from 'react'
import { useState,useRef } from 'react'

const App = () => {
  const [message , setMessage] = useState(['hi there' , 'hello there'])

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
    wsRef.current.send(JSON.stringify({
      type :'chat',
      payload: {
        message : msg
      }
    }))
  }

  return <>
    <div className='flex flex-col h-screen bg-black text-white '>
      <br />
      <br />
      <div className='h-[90vh]'>
        {message.map((e) =>{ 
          return <div className='m-3'> 
           <span className='border rounded p-3  bg-white text-black'>{e}</span>
           </div>
          })}
      </div>
      <div className='flex'>
        <input ref={inputRef} type="text" placeholder='Type your msg...' />
        <button onClick={clickHandler} className=''>Send</button>
      </div>
    </div>
  </>
}

export default App

