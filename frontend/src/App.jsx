import { useEffect } from 'react'
import { useState,useRef } from 'react'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Room from './pages/Room.jsx'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout.jsx'

const App = () => {
  return <>
  <Routes>
      <Route element={<Layout/>} >
          <Route path='/' element={<Home/>} />
          <Route path='/room/:id' element={<Room/>} />
      </Route>

      <Route path='/profile' element={<Profile/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>} />
  </Routes>
  </>
}

export default App

