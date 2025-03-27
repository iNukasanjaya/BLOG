import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTag, FaShieldAlt, FaTicketAlt } from 'react-icons/fa';
import Navbar from '../Components/Navbar';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedType, setSelectedType] = useState('Normal');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5185/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!event) return;

    const calculateTimeLeft = () => {
      const eventDate = new Date(event.date).getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [event]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="text-center mt-10 text-gray-600">Event not found.</div>;
  }

  const normalPrice = event.price;
  const vipPrice = normalPrice * 2;

  return (
    <>
      <div ref={navbarRef}>
        <Navbar />
      </div>
      <div
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
            event.imageUrl ? `http://localhost:5185${event.imageUrl}` : 'https://via.placeholder.com/1200x400?text=Event+Image'
          })`,
          paddingTop: `${navbarHeight}px`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            {event.title}
          </h1>
          <p className="text-lg md:text-xl text-white mt-4 drop-shadow-md">
            {event.category} • {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>
      </div>

      <section className="flex flex-col md:flex-row items-start justify-center p-6 md:p-12 lg:p-20 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
            {event.category}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            {event.description}
          </p>
          <div className="space-y-4">
            <p className="flex items-center text-gray-800">
              <FaCalendarAlt className="mr-3 text-purple-500" />
              <span>
                {new Date(event.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </p>
            <p className="flex items-center text-gray-800">
              <FaClock className="mr-3 text-purple-500" />
              <span>{event.time}</span>
            </p>
            <p className="flex items-center text-gray-800">
              <FaMapMarkerAlt className="mr-3 text-purple-500" />
              <span>{event.location}</span>
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Event Starts In</h3>
            <div className="flex justify-center space-x-4">
              <div>
                <p className="text-3xl font-bold">{timeLeft.days}</p>
                <p className="text-sm">Days</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{timeLeft.hours}</p>
                <p className="text-sm">Hours</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{timeLeft.minutes}</p>
                <p className="text-sm">Minutes</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{timeLeft.seconds}</p>
                <p className="text-sm">Seconds</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Ticket Type</h3>
            <div className="flex space-x-4">
              {['Normal', 'VIP'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedType === type
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate(`/checkout/${event.id}`, { state: { ticketType: selectedType, price: selectedType === 'Normal' ? normalPrice : vipPrice } })}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 text-lg font-semibold"
          >
            Buy {selectedType} Ticket
          </button>
          <p className="text-gray-600 flex items-center gap-2">
            <FaShieldAlt className="text-purple-500" />
            Money-Back Guarantee
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex justify-center p-6 md:p-12"
        >
          <img
            src={event.imageUrl ? `http://localhost:5185${event.imageUrl}` : 'https://via.placeholder.com/500x500?text=Event+Image'}
            alt={event.title}
            className="w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105"
          />
        </motion.div>
      </section>

      {/* Separate Ticket Pricing Box */}
      {/* Ticket Pricing Box (Sticky in Bottom-Right) */}
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 transform hover:shadow-3xl transition-all duration-300 z-40"
>
  <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
    <FaTicketAlt className="mr-3 text-purple-500" />
    Ticket Pricing
  </h3>
  <div className="space-y-4">
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <p className="text-gray-700 font-medium text-lg">Normal Ticket</p>
      <p className="text-purple-600 font-semibold text-lg">LKR {normalPrice}</p>
    </div>
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <p className="text-gray-700 font-medium text-lg">VIP Ticket</p>
      <p className="text-purple-600 font-semibold text-lg">LKR {vipPrice}</p>
    </div>
  </div>
</motion.div>
    </>
  );
}

export default EventDetails;