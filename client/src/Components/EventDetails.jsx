import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaShareAlt, FaArrowLeft } from 'react-icons/fa';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import Navbar from '../Components/Navbar';
import RelatedContent from './RelatedContent';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this event: ${event.title} on ${new Date(event.date).toLocaleDateString()}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll copy the link to clipboard
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share it on Instagram.');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Navbar />
      {/* Hero Section with Parallax and Breadcrumb */}
      <div
        className="relative bg-cover bg-center h-96 flex items-center justify-center mt-16 bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
            event.imageUrl ? `http://localhost:5185${event.imageUrl}` : 'https://via.placeholder.com/1200x400?text=Event+Image'
          })`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 drop-shadow-lg">
            {event.title}
          </h1>
          <div className="mt-4 text-white text-sm">
            <button onClick={() => navigate('/event-page')} className="hover:underline">
              Events
            </button>
            <span className="mx-2">/</span>
            <span>{event.title}</span>
          </div>
        </motion.div>
      </div>

      {/* Countdown and Image Section */}
      <section className="flex flex-col md:flex-row justify-center bg-gray-200 py-3">
      <div className="md:w-1/2 flex justify-center p-6 md:p-12">
          <img
            src={event.imageUrl ? `http://localhost:5185${event.imageUrl}` : 'https://via.placeholder.com/500x500?text=Event+Image'}
            alt={event.title}
            className="w-72 h-72 max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-glow border border-gray-200"
            loading="lazy"
          />
        </div>
        
        <div className="p-6 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Event Starts In</h3>
          <div className="flex justify-center space-x-4">
            {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-80 backdrop-blur-md border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                title={`Event Date: ${new Date(event.date).toLocaleString()}`}
              >
                <p className="text-3xl font-bold text-gray-800">{timeLeft[unit]}</p>
                <p className="text-sm text-gray-600 capitalize">{unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details and Tickets Section */}
      <section className="flex flex-col md:flex-row items-start justify-between p-6 md:p-12 lg:p-20 bg-gradient-to-br from-blue-50 to-purple-50 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] pointer-events-none"></div>

        <div className="md:w-1/2 bg-transparent rounded-2xl p-6 space-y-6 relative z-10">
          <p className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            {event.title}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {event.description}
          </p>
          <div className="space-y-4">
            <p className="flex items-center text-gray-800 group">
              <FaCalendarAlt className="mr-3 text-purple-500 group-hover:text-purple-700 transition-colors duration-300" />
              <span>
                {new Date(event.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </p>
            <p className="flex items-center text-gray-800 group">
              <FaClock className="mr-3 text-purple-500 group-hover:text-purple-700 transition-colors duration-300" />
              <span>{event.time}</span>
            </p>
            <p className="flex items-center text-gray-800 group">
              <FaMapMarkerAlt className="mr-3 text-purple-500 group-hover:text-purple-700 transition-colors duration-300" />
              <span>{event.location}</span>
            </p>
          </div>
          {/* Share Buttons */}
          <div className="flex items-center space-x-4 mt-6">
            <p className="text-gray-800 font-medium">Share Event:</p>
            <button onClick={() => handleShare('facebook')} className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
              <FiFacebook size={24} />
            </button>
            <button onClick={() => handleShare('twitter')} className="text-blue-400 hover:text-blue-600 transition-colors duration-300">
              <FiTwitter size={24} />
            </button>
            <button onClick={() => handleShare('instagram')} className="text-pink-500 hover:text-pink-700 transition-colors duration-300">
              <FiInstagram size={24} />
            </button>
          </div>
        </div>

        <div className="md:w-80 w-full mt-6 md:mt-0 md:sticky md:top-24">
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-purple-200 transform hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-blue-50">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Tickets</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <p className="text-gray-700 font-normal text-lg">Normal Ticket</p>
                <p className="font-semibold text-lg transform hover:scale-105 transition-transform duration-300">
                  LKR {normalPrice}
                </p>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <p className="text-gray-700 font-normal text-lg">VIP Ticket</p>
                <p className="font-semibold text-lg transform hover:scale-105 transition-transform duration-300">
                  LKR {vipPrice}
                </p>
              </div>
              <button
                onClick={() => navigate(`/checkout/${event.id}`)}
                className="w-full bg-black text-white rounded-lg font-semibold px-6 py-3 hover:bg-orange-500 transition-all duration-300 transform hover:scale-105"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Related Content Section */}
      <div className='py-12 px-6 md:px-12'>
        {event.category && <RelatedContent category={event.category} /> }
      </div>
    </>
  );
}

export default EventDetails;