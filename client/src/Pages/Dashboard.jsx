import React from 'react';

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-5">
      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Dashboard</h2>
      <ul className="space-y-4">
        <li><a href="#" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">🏡 Dashboard</a></li>
        <li><a href="#" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">📝 Article Management</a></li>
        <li><a href="#" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">🗞️ Event Management</a></li>
        <li><a href="#" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">👨‍💻 Advertisement Management</a></li>
        <li><a href="#" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">📷 Media Management</a></li>
      </ul>
      <button className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded">Logout</button>
    </div>
  );
};

const StatsCard = ({ title, count, borderColor }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition-all border-t-4 ${borderColor}`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  );
};

const Messages = () => {
  const messages = [
    { author: "Stephanie", text: "I got your first assignment. It was quite good 👍", date: "19 July", starred: true },
    { author: "David", text: "Hey, tell me about progress of project? Waiting for your response.", date: "21 July", starred: false },
    { author: "Alona", text: "I am really impressed with your work 😃", date: "15 July", starred: false }
  ];
  
  return (
    <aside className="bg-white p-6 rounded-lg shadow-lg h-fit">
      <h2 className="text-xl font-semibold mb-4">Client Messages</h2>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
            <p className="text-sm text-gray-600">{msg.date}</p>
            <p className="font-semibold">{msg.author}</p>
            <p className="text-gray-700">{msg.text}</p>
            <span className={`text-yellow-500 text-xl ${msg.starred ? "opacity-100" : "opacity-30"}`}>★</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
        </header>
        <section className="grid md:grid-cols-3 gap-6">
          <StatsCard title="Total Articles" count="120" borderColor="border-blue-500" />
          <StatsCard title="Total Advertisements" count="100" borderColor="border-orange-500" />
          <StatsCard title="Active Users" count="150" borderColor="border-green-500" />
        </section>
        <div className="mt-8">
          <Messages />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
