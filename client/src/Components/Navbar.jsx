import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // For mobile menu animations
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To determine the active route
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate logged-in state

  // Check if user is logged in (replace with your auth logic)
  useEffect(() => {
    const token = localStorage.getItem('token'); // Example: Check for a token
    setIsLoggedIn(!!token);
  }, []);

  // Toggle mobile menu (optimized with useCallback)
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle logout (replace with your auth logic)
  const handleLogout = () => {
    localStorage.removeItem('token'); // Example: Remove token
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Navigation links array for DRY code
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' }, // Consistent route
    { to: '/movies', label: 'Movies' }, // Fixed route
    { to: '/ads', label: 'Ads' }, // Fixed route
    { to: '/about', label: 'About' }, // Fixed route
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
                location.pathname === link.to ? 'text-purple-400 border-b-2 border-purple-400' : 'hover:text-purple-400'
              }`}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Login/Logout Button (Desktop) */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
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
                  location.pathname === link.to ? 'text-purple-400' : 'hover:text-purple-400'
                }`}
                onClick={toggleMenu}
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
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