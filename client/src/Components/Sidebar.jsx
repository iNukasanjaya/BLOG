import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Sidebar = () => {
  const navigate = useNavigate();
  let userRole = null;

  // Decode the token to get the user's role
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    if (!token) {
      alert('You are not logged in.');
      return;
    }
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      alert('Logged out successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-5">
      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Dashboard</h2>
      <ul className="space-y-4">
        {/* Dashboard Link (Always Visible) */}
        <li>
          <Link to="/dashboard" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
            🏡 Dashboard
          </Link>
        </li>

        {/* If user is not logged in, show all management sections */}
        {!userRole && (
          <>
            <li>
              <Link to="/articles" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
                📝 Article Management
              </Link>
            </li>
            <li>
              <Link to="/events" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
                🗞️ Event Management
              </Link>
            </li>
            <li>
              <Link to="/advertisements" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
                👨‍💻 Advertisement Management
              </Link>
            </li>
            <li>
              <Link to="/media" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
                📷 Media Management
              </Link>
            </li>
          </>
        )}

        {/* If user is logged in, show only their specific management section */}
        {userRole === 'ArticleAdmin' && (
          <li>
            <Link to="/articles" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
              📝 Article Management
            </Link>
          </li>
        )}
        {userRole === 'EventAdmin' && (
          <li>
            <Link to="/events" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
              🗞️ Event Management
            </Link>
          </li>
        )}
        {userRole === 'AdvertisementAdmin' && (
          <li>
            <Link to="/advertisements" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
              👨‍💻 Advertisement Management
            </Link>
          </li>
        )}
        {userRole === 'MediaAdmin' && (
          <li>
            <Link to="/media" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
              📷 Media Management
            </Link>
          </li>
        )}

        {/* Change Password (Visible Only After Login) */}
        {userRole && (
          <li>
            <Link to="/change-password" className="block px-4 py-2 bg-gray-600 hover:bg-gray-800 rounded">
              🔑 Change Password
            </Link>
          </li>
        )}
      </ul>

      {/* Logout Button (Always Visible, Disabled Before Login) */}
      <button
        onClick={handleLogout}
        className={`mt-6 w-full py-2 rounded ${
          userRole ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 cursor-not-allowed'
        }`}
        disabled={!userRole}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;