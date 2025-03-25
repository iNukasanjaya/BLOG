import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5185/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        await axios.delete(`http://localhost:5185/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setEvents(events.filter(event => event.id !== id));
        setFilteredEvents(filteredEvents.filter(event => event.id !== id));
        alert('Event deleted successfully!');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert(err.message || 'Failed to delete event. Please try again.');
      }
    }
  };

  // Handle report generation (placeholder)
  const handleGenerateReport = () => {
    // For now, we'll just log the events to the console
    // In a real app, you might generate a PDF or CSV
    console.log('Generating report for events:', events);
    alert('Report generation is not implemented yet. Check the console for event data.');
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Event Dashboard </h2>
        <div className="flex space-x-4">
          <Link to="/events/add">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
              Add Event
            </button>
          </Link>
          <button
            onClick={handleGenerateReport}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search events by title, venue, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <div className="text-center text-gray-600">No events found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Image</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Title</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Price (LKR)</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Description</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Date</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Time</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Venue</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Category</th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4">
                    {event.imageUrl ? (
                      <img
                        src={`http://localhost:5185${event.imageUrl}`}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-800">{event.title}</td>
                  <td className="py-3 px-4 text-gray-800">{event.price}</td>
                  <td className="py-3 px-4 text-gray-600">{event.description}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{event.time}</td>
                  <td className="py-3 px-4 text-gray-600">{event.location}</td>
                  <td className="py-3 px-4 text-gray-600">{event.category}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link to={`/events/update/${event.id}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition duration-300">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventList;