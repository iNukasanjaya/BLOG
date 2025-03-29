import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddMedia() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
    });
    setErrors({});
  };

  const addMedia = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    const mediaData = {
      title: formData.title,
      description: formData.description,
    };

    console.log("Sending Media data:", mediaData);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.post('http://localhost:5185/api/medias', mediaData, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Response from backend:", response.data);
      alert("Media added successfully!");
      resetForm();
      navigate("/media");
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add media.";
      alert(errorMessage);
      if (error.response?.status === 401 || error.message === "No token found. Please log in.") {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-full w-full sm:max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-600">
          Create Media
        </h2>
        <form onSubmit={addMedia} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter media title"
              disabled={loading}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter media description"
              rows="4"
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-2 rounded-md hover:bg-gradient-to-l transition-all duration-300 ease-in-out ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              } flex items-center justify-center`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Adding..." : "Add Media"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMedia;