import React from "react";
import calander from "../assets/calander12.png";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center h-screen text-center bg-gradient-to-r from-pink-200 to-blue-200 px-10">
      {/* Overlay to improve text visibility */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Hero Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
        {/* Left Side: Text */}
        <div className="md:w-1/2 text-left">
          <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Let's book your event
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Experience the best moments with us!
          </p>

          {/* Call-to-Action Button */}
          <Link
            to="event-list"
            smooth={true}
            duration={800}
            className="mt-6 inline-block font-bold bg-white text-black px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition cursor-pointer"
          >
            Explore Events
          </Link>
        </div>

        {/* Right Side: 3D Hero Image */}
        {/* <div className="md:w-1/2 flex justify-center"> */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            whileDrag={{ scale: 0.9, rotate: 10 }}
            drag
            
          >
          <img
            src={calander}
            alt="3D Event"
            className="mt-6 md:mt-0 w-full max-w-md rounded-xl shadow-lg"
          />
          </motion.div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default Hero;
