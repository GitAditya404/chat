import React from 'react'
import { useEffect } from 'react'

const Home = () => {

  useEffect(() => {
    fetch()
  },[])

  return (
    <>
    <div className='OUTER flex w-full h-screen bg-amber-500'>

        <div className='SIDEBAR flex flex-col border-2 w-1/3 px-7 py-2'>

            <div className='flex border items-start'>
                <h1 className='border  text-3xl'>Connect</h1>
                <button className='border ml-auto rounded bg-blue-600 text-white p-2'>Profile</button>
            </div>
            <div className='border-4 flex-1 bg-red-600 '>
                    
            </div>

        </div>

        <div className='RIGHT border bg-rose-500 w-2/3'>

        </div>
    </div>
    </>
  )
}

export default Home
