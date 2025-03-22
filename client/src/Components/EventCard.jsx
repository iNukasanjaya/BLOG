import React from 'react'
import hero from "../assets/hero.png";
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {

  const navigate = useNavigate;
    return (
      <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full sm:w-80 transform transition duration-300 hover:rotate-3">
        {/* Event Image */}
        <img 
          src={hero} 
          alt="hello"
          className="w-full h-72 object-cover transition-opacity duration-300 hover:opacity-80"
        />
  
        {/* Event Details */}
        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-800">title</h3>
          <p className="text-sm text-gray-500 mt-2">23/04/2025</p>
          <p className="text-gray-600 mt-5 text-sm">description</p>
  
          {/* CTA Button */}
          <button onClick={() => navigate("/eventdetails")} className="mt-4 w-full cursor-pointer bg-black hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
            View Details
          </button>
        </div>
      </div>
    );
  };
  
  export default EventCard;
  