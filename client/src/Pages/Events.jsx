import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../Components/EventCard';
import Hero from './Hero';
import Navbar from '../Components/Navbar';

function Events() {
  const [events, setEvents] = useState([]); // State to store fetched events
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(''); // State for error messages

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5185/api/events');
        setEvents(response.data); // Store the fetched events in state
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <Navbar />
      <Hero />
      <div id="event-list" className="py-16 px-6 md:px-12 bg-blue-50">
        <h2 className="text-3xl font-bold p-6 text-gray-800 text-center">Upcoming Events</h2>
        {/* Display loading, error, or events */}
        {loading ? (
          <div className="text-center text-gray-600">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-600">No upcoming events found.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 p-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Events;