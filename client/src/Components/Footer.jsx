import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setSubscriptionMessage('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSubscriptionMessage('Please enter a valid email address.');
      return;
    }
    // Simulate a subscription API call
    setTimeout(() => {
      setSubscriptionMessage('Thank you for subscribing!');
      setEmail('');
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 relative">
      {/* Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600"></div>

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white tracking-wide">Eventify</h2>
            <p className="text-gray-400 leading-relaxed">
              Eventify is your go-to platform for discovering and managing events, articles, and more. Join us to experience the best moments in journalism, music, and economics.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF />, link: 'https://facebook.com', color: 'hover:text-blue-600' },
                { icon: <FaTwitter />, link: 'https://twitter.com', color: 'hover:text-blue-400' },
                { icon: <FaInstagram />, link: 'https://instagram.com', color: 'hover:text-pink-500' },
                { icon: <FaLinkedinIn />, link: 'https://linkedin.com', color: 'hover:text-blue-700' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transform hover:scale-110 transition-all duration-300`}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Site Map</h3>
            <ul className="space-y-2">
              {[
                { name: 'Articles', link: '/' },
                { name: 'Events', link: '/event-page' },
                { name: 'Movies', link: '/movies' },
                { name: 'Ads', link: '/ads' },
                { name: 'Contact', link: '/contact' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Methods */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-orange-500" />
                <a
                  href="mailto:support@eventify.com"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                >
                  support@eventify.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-orange-500" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-block mt-2 px-4 py-2 bg-transparent border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest events and news!</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
            {subscriptionMessage && (
              <p className={`mt-3 text-sm ${subscriptionMessage.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
                {subscriptionMessage}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700"></div>

        {/* Copyright and Back to Top */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center space-x-2 bg-orange-500 text-white rounded-full px-4 py-2 hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <FaArrowUp />
            {/* <span>Back to Top</span> */}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;