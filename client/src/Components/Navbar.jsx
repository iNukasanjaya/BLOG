import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For mobile menu and popup animations
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To determine the active route
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Logged-in state
  const [userName, setUserName] = useState(''); // Store user's name
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  // Check if user is logged in and get user name
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserName(storedUser.name || 'User'); // Fallback to 'User' if name is not available
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []);

  // Toggle mobile menu (optimized with useCallback)
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Toggle popup visibility
  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('user'); // Remove user data
    setIsLoggedIn(false);
    setUserName('');
    setShowPopup(false); // Close the popup
    navigate('/'); // Navigate to home page
  };

  // Navigation links array for DRY code
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/event-page', label: 'Events' },
    { to: '/movies', label: 'Movies' },
    { to: '/ads', label: 'Ads' },
    { to: '/about', label: 'About' },
  ];

  return (
    <div className="bg-black shadow-lg w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto px-5 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          NEWS
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-white font-medium transition-all duration-300 ${
                location.pathname === link.to ? 'text-purple-400 border-b-2 border-orange-500' : 'hover:text-orange-500'
              }`}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Login/Avatar Button (Desktop) */}
        <div className="hidden md:flex items-center relative">
          {isLoggedIn ? (
            <div>
              <button
                onClick={togglePopup}
                className="focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold transition-all duration-300 hover:ring-2 hover:bg-orange-500 cursor-pointer">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>
              {/* Popup Box */}
              <AnimatePresence>
                {showPopup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 bg-gray-800 text-white rounded-lg shadow-lg p-4 w-48 z-50 flex flex-col items-center space-y-3"
                  >
                    <p className="text-sm font-medium">Hello, {userName}!</p>
                    <button
                      onClick={handleLogout}
                      className="w-32 bg-white text-black font-bold px-3 py-2 rounded-lg hover:bg-orange-500 transition-all duration-300 cursor-pointer"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-32 bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-orange-500 transition-all duration-300 cursor-pointer"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 rounded cursor-pointer"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col items-center bg-black text-white py-5 space-y-4 absolute w-full top-[64px] left-0 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-lg transition-all duration-300 ${
                  location.pathname === link.to ? 'text-orange-500' : 'hover:text-orange-500'
                }`}
                onClick={toggleMenu}
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={togglePopup}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold transition-all duration-300 hover:ring-2 hover:bg-orange-500 cursor-pointer"
                  aria-label="User menu"
                >
                  {userName.charAt(0).toUpperCase()}
                </button>
                {/* Popup Box for Mobile */}
                <AnimatePresence>
                  {showPopup && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-lg shadow-lg p-4 w-48 z-50 flex flex-col items-center space-y-3"
                    >
                      <p className="text-sm font-medium">Hello, {userName}!</p>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="w-32 bg-white text-black font-bold px-3 py-2 rounded-full hover:bg-orange-500 transition-all duration-300 cursor-pointer"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 cursor-pointer"
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;