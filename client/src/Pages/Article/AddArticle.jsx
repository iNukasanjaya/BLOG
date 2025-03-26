import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AddArticle() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    publicationDate: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const { id } = useParams(); // Get article ID from URL for editing
  const navigate = useNavigate();
  const isEditing = !!id; // Determine if we're editing based on the presence of an ID

  const categories = [
    'Technology',
    'Lifestyle',
    'Science',
    'Health',
    'Education',
    'Environment',
    'History',
    'Self-Help',
  ];

  // Fetch article data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found. Please log in.');
          }

          const response = await axios.get(`http://localhost:5185/api/articles/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const article = response.data;
          setFormData({
            title: article.title,
            author: article.author,
            category: article.category,
            content: article.content,
            publicationDate: article.publicationDate.split('T')[0], // Format date for input
            image: null, // Image will be re-uploaded if changed
          });
          setImagePreview(article.imageUrl ? `http://localhost:5185${article.imageUrl}` : '');
        } catch (err) {
          console.error('Error fetching article:', err);
          if (err.response?.status === 401 || err.message === 'No token found. Please log in.') {
            localStorage.removeItem('token');
            alert('Session expired. Please log in again.');
            navigate('/login');
          } else {
            alert('Failed to load article. Please try again.');
            navigate('/articles');
          }
        }
      };
      fetchArticle();
    }
  }, [id, isEditing, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = 'Title is required!';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long.';
    }

    if (!formData.author) {
      newErrors.author = 'Author is required!';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required!';
    }

    if (!formData.content) {
      newErrors.content = 'Content is required!';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters long.';
    }

    if (!formData.publicationDate) {
      newErrors.publicationDate = 'Publication date is required!';
    } else if (new Date(formData.publicationDate) > new Date()) {
      newErrors.publicationDate = 'Publication date cannot be in the future.';
    }

    if (!isEditing && !formData.image) {
      newErrors.image = 'Image is required!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('publicationDate', formData.publicationDate);
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        if (isEditing) {
          // Update existing article
          await axios.put(`http://localhost:5185/api/articles/${id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          });
          alert('Article updated successfully!');
        } else {
          // Add new article
          await axios.post('http://localhost:5185/api/articles', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          });
          alert('Article added successfully!');
        }

        navigate('/articles');
      } catch (err) {
        console.error('Error submitting form:', err);
        if (err.response?.status === 401 || err.message === 'No token found. Please log in.') {
          localStorage.removeItem('token');
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          alert('Failed to save article. Please try again.');
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-full w-full sm:max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-600">
          {isEditing ? 'Edit Article' : 'Add News Article'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter article title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.author ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((categoryItem, index) => (
                <option key={index} value={categoryItem.toLowerCase()}>
                  {categoryItem}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter article content"
              rows="4"
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="publicationDate" className="block text-sm font-medium">
              Publication Date
            </label>
            <input
              type="date"
              id="publicationDate"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
              className={`border w-full px-4 py-2 rounded-md mt-2 ${
                errors.publicationDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.publicationDate && (
              <p className="text-red-500 text-xs mt-1">{errors.publicationDate}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="imageUpload" className="block text-sm font-medium">
              Upload Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="border w-full px-4 py-2 rounded-md mt-2"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-md"
              />
            )}
          </div>

            <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-2 rounded-md hover:bg-gradient-to-l"
            >
                Submit
            </button>
          
        </form>
      </div>
    </div>
  );
}

export default AddArticle;