import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import AccDetails from './Pages/AccDetails'
import Navbar from './Components/Navbar'
import Hero from './Pages/Hero'
import Events from './Pages/Events'
import EventCard from './Components/EventCard'
import EventDetails from './Components/EventDetails'
import Dashboard from './Pages/Dashboard'
import AddEvent from './Pages/Event/AddEvent'
import UpdateEvent from './Pages/Event/UpdateEvent'

function App() {
  

  return (
    <div>
      <BrowserRouter>
      
      <Routes>
        <Route path='/' element={<Hero />}></Route>
        <Route path='/events' element={<Events />}></Route>
        <Route path='/eventdetails' element={<EventDetails />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/acc' element={<AccDetails />}></Route>
        <Route path='/nav' element={<Navbar />}></Route>
        <Route path='/admin' element={<Dashboard />}></Route>
        <Route path='/add' element={<AddEvent />}></Route>
        <Route path='/update/:id' element={<UpdateEvent />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
