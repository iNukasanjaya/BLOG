import React from "react";

function AccDetails() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white via-gray-600 to-white p-6">
      
      {/* Header Section */}
      <section className="w-full max-w-4xl text-center mb-10">
        <div className="p-10 bg-opacity-20 backdrop-blur-md bg-black rounded-xl shadow-lg text-white">
          <h1 className="text-5xl font-extrabold tracking-wide">
            Hello, <span>Inuka</span> 👋
          </h1>
        </div>
      </section>

      {/* Account Details Card */}
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg max-w-lg w-full text-white">
        
        <h2 className="text-3xl font-semibold text-center mb-6">Account Details</h2>
        
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="text-sm font-semibold text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-sm font-semibold text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-semibold text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-white text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-1/3 mt-6 py-3 text-lg font-semibold bg-black hover:bg-red-700 transition duration-300 rounded-lg shadow-md mx-auto block">
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccDetails;
