import React from 'react'
import EventCard from '../Components/EventCard'
import Hero from './Hero'

function Events() {
  return (
    <>
    <Hero />
    <div id="event-list" className="py-16 px-6 md:px-12 bg-blue-50">
      <h2 className="text-3xl font-bold p-6 text-gray-800 text-center">Upcoming Events</h2>
      {/* Event Cards / List Here */}
      <div className='flex flex-wrap justify-center gap-6 p-4'>
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </div>
    </>
  )
}

export default Events