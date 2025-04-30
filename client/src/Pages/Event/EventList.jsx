import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default'); // Default sort option
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
    // Then, sort the filtered events based on the sortOption
    if (sortOption !== 'default') {
      filtered.sort((a, b) => {
        if (sortOption === 'newest-added-first') {
          const createdAtA = new Date(a.createdAt).getTime() || 0;
          const createdAtB = new Date(b.createdAt).getTime() || 0;
          return createdAtB - createdAtA;  
        } else if (sortOption === 'date-new-to-old') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortOption === 'date-old-to-new') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortOption === 'price-up-to-down') {
          return a.price - b.price;
        } else if (sortOption === 'price-down-to-up') {
          return b.price - a.price;
        }
        return 0;
      });
    }
    setFilteredEvents([...filtered]);
  }, [searchTerm, events, sortOption]);

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
        if (err.response?.status === 401 || err.message === 'No token found. Please log in.') {
          localStorage.removeItem('token');
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          alert(err.message || 'Failed to delete event. Please try again.');
        }
      }
    }
  };

  // Handle report generation
  const totalEvents = events.length;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleGenerateReport = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 10;

    // Add Header
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text('Event Summary Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;

    // Add Overview: Total Events
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81);
    doc.text('Overview', 10, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text(`Total Events: ${totalEvents}`, 10, yOffset);
    yOffset += 10;

    // Add Detailed Event List (No Category Separation)
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81);
    doc.text('Event Details List', 10, yOffset);
    yOffset += 10;

    for (const event of events) {
      if (yOffset > pageHeight - 50) {
        doc.addPage();
        yOffset = 10;
      }

      if (event.imageUrl) {
        try {
          const imgResponse = await fetch(`http://localhost:5185${event.imageUrl}`);
          const imgBlob = await imgResponse.blob();
          const imgBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imgBlob);
          });
          const imgWidth = 30;
          const imgHeight = 30;
          doc.addImage(imgBase64, 'JPEG', 10, yOffset, imgWidth, imgHeight);
          yOffset += imgHeight + 5;
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }

      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text(`Title: ${event.title}`, 10, yOffset);
      yOffset += 6;
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      doc.text(`Date: ${new Date(event.date).toLocaleDateString()} at ${event.time}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Location: ${event.location}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Category: ${event.category}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Price: LKR ${event.price.toFixed(2)}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Description: ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Created By: ${event.createdBy}`, 10, yOffset);
      yOffset += 10;
    }

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by NewsWebsiteApi | Contact: support@newswebsite.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save('EventReport.pdf');
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 px-6 pt-6">
        <h2 className="text-3xl font-bold text-gray-800">Event Dashboard</h2>
        <div className="flex space-x-4">
          <Link to="/events/add">
            <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:scale-105 hover:opacity-90">
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

      {/* Search Bar and Sort Options */}
      <div className="mb-6 flex items-center space-x-4 px-6">
        <input
          type="text"
          placeholder="Search events by title, venue, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <div className="flex items-center space-x-2">
          <label htmlFor="sortOption" className="text-gray-600 font-medium">
            Sort By:
          </label>
          <select
            id="sortOption"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="default">Default</option>
            <option value="newest-added-first">Newest Added First</option>
            <option value="date-new-to-old">Date (New to Old)</option>
            <option value="date-old-to-new">Date (Old to New)</option>
            <option value="price-up-to-down">Price (Up to Down)</option>
            <option value="price-down-to-up">Price (Down to Up)</option>
          </select>
        </div>
      </div>

      {/* Events Table with Scrollable Container */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-600">No events found.</div>
        ) : (
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg">
            <table className="min-w-full bg-white shadow-md">
              <thead className="bg-gray-100">
                <tr className="sticky top-0 z-10 bg-gray-100">
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
                          className="w-24 h-24 object-cover rounded-xl"
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
    </div>
  );
}

export default EventList;