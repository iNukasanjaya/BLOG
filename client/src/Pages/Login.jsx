import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5185/api/auth/login', {
        username: formData.username,
        password: formData.password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // Store the token

      // Decode the token to get the user's role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

      // Redirect based on the user's role
      switch (userRole) {
        case 'ArticleAdmin':
          navigate('/articles');
          break;
        case 'EventAdmin':
          navigate('/events');
          break;
        case 'AdvertisementAdmin':
          navigate('/advertisements');
          break;
        case 'MediaAdmin':
          navigate('/media');
          break;
        default:
          setError('Unknown role. Please contact support.');
          localStorage.removeItem('token'); // Remove token if role is invalid
          return;
      }
      alert('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-white via-gray-600 to-white">
      <div className="flex w-[900px] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Sign In */}
        <div className="w-3/5 p-20 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <span className="p-2 border rounded-full cursor-pointer hover:bg-gray-200 text-xl">
                <FaGoogle />
              </span>
              <span className="p-2 border rounded-full cursor-pointer hover:bg-gray-200 text-xl">
                <FaFacebookF />
              </span>
              <span className="p-2 border rounded-full cursor-pointer hover:bg-gray-200 text-xl">
                <FaXTwitter />
              </span>
            </div>
            <p className="text-center text-gray-500 mb-4">
              or use your email for registration
            </p>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email or Username"
              className="w-full p-3 border rounded-md mb-3 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border rounded-md mb-3 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <h3 className="mb-3 text-gray-500">Forgot Password?</h3>
            <button className="bg-black text-white w-full py-3 rounded-full hover:bg-[#454646] transition duration-300">
              SIGN IN
            </button>
          </form>
        </div>

        {/* Right Side - Sign Up */}
        <div className="w-2/5 p-8 bg-black text-white flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">Hello!</h2>
          <p className="text-center mb-6">
            "Create an account and become a part of our community. Join us today!"
          </p>
          <button className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#122343] transition duration-300">
            <Link to="/signup">SIGN UP</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;