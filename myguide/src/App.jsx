import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Login from './Components/Login'
import Home from './Components/Home'
import Signup from './Components/Signup'
import Guideregister from './Components/Guideregister'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Searchresult from './Components/Searchresult'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/guideregister' element={<Guideregister/>}></Route>
      <Route path='/searchresult' element={<Searchresult/>}></Route>
    </Routes>   
    </BrowserRouter>
   
    </>
  )
}

export default App
