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
import EventList from './Pages/Event/EventList'
import EventLayout from './Components/EventLayout'
import ProtectedRoute from './Components/ProtectedRoute'
import ArticleList from './Pages/Article/ArticleList'
import AddArticle from './Pages/Article/AddArticle'
import UpdateArticle from './Pages/Article/UpdateArticle'


function App() {
  

  return (
    <div>
      <BrowserRouter>
      
      <Routes>
        <Route path='/' element={<Hero />}></Route>
        <Route path='/event-page' element={<Events />}></Route>
        <Route path='/eventdetails/:id' element={<EventDetails />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/acc' element={<AccDetails />}></Route>
        <Route path='/nav' element={<Navbar />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        
        <Route path='/list' element={<EventList />}></Route>
        <Route element={<EventLayout />}>
          <Route path='/events' element={<ProtectedRoute requiredRole="EventAdmin"><EventList /></ProtectedRoute>}/>
          <Route path='/events/add' element={<ProtectedRoute requiredRole="EventAdmin"><AddEvent /></ProtectedRoute>}/>
          <Route path='/events/update/:id' element={<ProtectedRoute requiredRole="EventAdmin"><UpdateEvent /></ProtectedRoute>}/>

          <Route path='/articles' element={<ProtectedRoute requiredRole="ArticleAdmin"><ArticleList /></ProtectedRoute>}/>
          <Route path='/articles/add' element={<ProtectedRoute requiredRole="ArticleAdmin"><AddArticle /></ProtectedRoute>}/>
          <Route path='/articles/update/:id' element={<ProtectedRoute requiredRole="ArticleAdmin"><UpdateArticle /></ProtectedRoute>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
