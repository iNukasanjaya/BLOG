import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateEvent() {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate(); // For redirecting after update
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [generalError, setGeneralError] = useState(null); // For backend errors
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [submitting, setSubmitting] = useState(false); // For form submission

  // Fetch the event data when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5185/api/events/${id}`);
        const event = response.data;
        // Format the date to yyyy-MM-dd for the input field
        const formattedDate = new Date(event.date).toISOString().split('T')[0];
        setFormData({
          title: event.title,
          price: event.price.toString(),
          description: event.description,
          date: formattedDate,
          time: event.time,
          location: event.location,
          category: event.category,
          image: null, // Image will be updated if a new one is uploaded
        });
        setImagePreview(event.imageUrl ? `http://localhost:5185${event.imageUrl}` : null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setGeneralError("Failed to load event details. Please try again.");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const validate = () => {
    let newErrors = {};

    // Title validation
    if (!formData.title) {
      newErrors.title = "Title is required.";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters long.";
    } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.title)) {
      newErrors.title = "Title can only include letters, numbers, and spaces.";
    }

    // Price validation
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number.";
    }

    // Description validation
    if (!formData.description) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters long.";
    }

    // Date validation
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    if (!formData.date) {
      newErrors.date = "Date is required.";
    } else if (selectedDate < today) {
      newErrors.date = "Date must not be in the past.";
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = "Time is required.";
    } else if (!/^\d{2}:\d{2}$/.test(formData.time)) {
      newErrors.time = "Time must be in the format HH:mm (e.g., 14:30).";
    }

    // Location validation
    if (!formData.location) {
      newErrors.location = "Location is required.";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required.";
    }

    // Image validation (only if a new image is uploaded)
    if (formData.image) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = "Only JPEG and PNG images are allowed.";
      } else if (formData.image.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.image = "Image size cannot exceed 5MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setGeneralError(null); // Clear general error on change
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
    setGeneralError(null); // Clear general error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Set submitting to true
    setGeneralError(null); // Clear previous general errors

    if (validate()) {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("date", formData.date);
        formDataToSend.append("time", formData.time);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("category", formData.category);
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }

        const response = await axios.put(`http://localhost:5185/api/events/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Event updated:", response.data);
        alert("Event updated successfully!");
        navigate('/events'); // Redirect to the events list page
      } catch (error) {
        console.error("Error updating event:", error);
        const errorMessage = error.response?.data || error.message;
        setGeneralError('Failed to update event: ' + (typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)));
      } finally {
        setSubmitting(false); // Reset submitting state
      }
    } else {
      setSubmitting(false); // Reset submitting if validation fails
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-extrabold text-center mb-6">Update Event</h2>
      {generalError && <p className="text-red-500 text-center mb-4 text-sm">{generalError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        <div>
          <label className="block font-medium">Ticket Price (LKR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.price ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Set minimum date to today
              className={`w-full p-2 border ${errors.date ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div>
            <label className="block font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.time ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
          </div>
        </div>
        <div>
          <label className="block font-medium">Venue</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select a category</option>
            <option value="Journalism">Journalism</option>
            <option value="Economical">Economical</option>
            <option value="Musical">Musical</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>
        <div>
          <label className="block font-medium">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full p-2 border ${errors.image ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
        </div>
        <button
          type="submit"
          className={`w-1/4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-2 rounded ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
}

export default UpdateEvent;