import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for the menu

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-black shadow-lg w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto px-5 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-white text-2xl font-bold cursor-pointer">
          NEWS
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10">
          <Link to="/" className="text-white font-medium hover:text-gray-400 transition">Home</Link>
          <Link to="/events" className="text-white font-medium hover:text-gray-400 transition">Events</Link>
          <Link to="/acc" className="text-white font-medium hover:text-gray-400 transition">Movies</Link>
          <Link to="/acc" className="text-white font-medium hover:text-gray-400 transition">Ads</Link>
          <Link to="/acc" className="text-white font-medium hover:text-gray-400 transition">About</Link>
        </div>

        {/* Login Button */}
        <button onClick={() => navigate("/login")} 
          className="hidden md:block bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition">
          Login
        </button>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-white text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-black text-white py-5 space-y-4">
          <Link to="/" className="text-lg" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/events" className="text-lg" onClick={() => setIsOpen(false)}>Events</Link>
          <Link to="#" className="text-lg" onClick={() => setIsOpen(false)}>Ads</Link>
          <Link to="/acc" className="text-lg" onClick={() => setIsOpen(false)}>Movies</Link>
          <button onClick={() => navigate("/login")} 
            className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-300 transition">
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
