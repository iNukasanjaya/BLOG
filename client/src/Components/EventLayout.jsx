import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';



const EventLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> {/* Renders the child route (EventList, AddEvent, UpdateEvent) */}
      </main>
    </div>
  );
};

export default EventLayout;