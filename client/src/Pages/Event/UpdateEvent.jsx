import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // For getting the event ID and navigation

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
  const [loading, setLoading] = useState(true);

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
        alert("Failed to load event details. Please try again.");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const validate = () => {
    let newErrors = {};
    if (!/^[a-zA-Z0-9 ]+$/.test(formData.title)) {
      newErrors.title = "Title can only include letters, numbers, and spaces.";
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Enter a valid price.";
    }
    if (!formData.description) {
      newErrors.description = "Description is required.";
    }
    if (!formData.date) {
      newErrors.date = "Date is required.";
    }
    if (!formData.time) {
      newErrors.time = "Time is required.";
    }
    if (!formData.location) {
      newErrors.location = "Location is required.";
    }
    if (!formData.category) {
      newErrors.category = "Category is required.";
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
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            'Authorization': `Bearer ${token}`, // Replace with actual token
          },
        });

        console.log("Event updated:", response.data);
        alert("Event updated successfully!");
        navigate('/events'); // Redirect to the events list page (adjust the route as needed)
      } catch (error) {
        console.error("Error updating event:", error);
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          alert(`Failed to update event: ${error.response.data || "Please try again."}`);
        } else {
          alert("Failed to update event. Please try again.");
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-extrabold text-center mb-6">Update Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded`}
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
            className={`w-full p-2 border ${errors.price ? "border-red-500" : "border-gray-300"} rounded`}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded`}
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
              className={`w-full p-2 border ${errors.date ? "border-red-500" : "border-gray-300"} rounded`}
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
              className={`w-full p-2 border ${errors.time ? "border-red-500" : "border-gray-300"} rounded`}
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
            className={`w-full p-2 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded`}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.category ? "border-red-500" : "border-gray-300"} rounded`}
          >
            <option value="">Select a category</option>
            <option value="Journalism">Journalism</option>
            <option value="Economical">Econimical</option>
            <option value="Musical">Musical</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>
        <div>
          <label className="block font-medium">Event Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Update Event</button>
      </form>
    </div>
  );
}

export default UpdateEvent;