import React, { useState } from "react";
import calander from "../assets/calander12.png";

const EventDetails = () => {
  const [selectedSize, setSelectedSize] = useState("Standard");

  return (
    <section className="flex flex-col md:flex-row items-center justify-center p-20 bg-gray-100 min-h-screen">
      {/* Left Side: Event Info */}
      <div className="md:w-1/2 bg-purple-200 space-y-4">
        <p className="text-gray-500">Event / Conference</p>
        <h1 className="text-4xl font-bold">Tech Innovators Summit 2025</h1>
        <p className="text-2xl font-semibold text-gray-700">$150</p>

        <p className="text-gray-600">
          Join the biggest technology event of the year! Explore the latest
          innovations, network with industry leaders, and gain insights into the
          future of technology.
        </p>

        <p className="text-green-600 font-medium">✔ Tickets Available</p>

        {/* Ticket Size Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ticket Type</h3>
          <div className="flex gap-4">
            {["Standard", "VIP"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg border ${
                  selectedSize === type
                    ? "border-blue-600 bg-blue-100 text-blue-600"
                    : "border-gray-300 text-gray-600"
                }`}
                onClick={() => setSelectedSize(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">
          Buy Ticket
        </button>

        <p className="text-gray-500 flex items-center gap-2">
          <span>🛡️</span> Money-Back Guarantee
        </p>
      </div>

      {/* Right Side: Event Image */}
      <div className="md:w-1/2 flex justify-center p-20 bg-stone-300 mt-6 md:mt-0">
        <img
          src={calander} // Replace with actual event image
          alt="Event"
          className="w-full max-w-md rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
};

export default EventDetails;
