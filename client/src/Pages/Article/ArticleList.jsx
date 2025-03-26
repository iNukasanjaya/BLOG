import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5185/api/articles');
        setArticles(response.data);
        setFilteredArticles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles. Please try again.');
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = articles.filter((article) => {
      const matchesAuthor = article.author
        .toLowerCase()
        .includes(searchAuthor.toLowerCase());
      const articleDate = new Date(article.publicationDate);
      const searchDateObj = searchDate ? new Date(searchDate) : null;
      const matchesDate =
        !searchDate || articleDate.toDateString() === searchDateObj?.toDateString();
      const matchesCategory =
        !searchCategory || article.category.toLowerCase().includes(searchCategory.toLowerCase());
      return matchesAuthor && matchesDate && matchesCategory;
    });
    setFilteredArticles([...filtered]);
  }, [searchAuthor, searchDate, searchCategory, articles]);

  // Handle delete with authentication
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        await axios.delete(`http://localhost:5185/api/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setArticles(articles.filter((article) => article.id !== id));
        setFilteredArticles(filteredArticles.filter((article) => article.id !== id));
        alert('Article deleted successfully!');
      } catch (err) {
        console.error('Error deleting article:', err);
        if (err.response?.status === 401 || err.message === 'No token found. Please log in.') {
          localStorage.removeItem('token');
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          alert(err.message || 'Failed to delete article. Please try again.');
        }
      }
    }
  };

  // Handle report generation (placeholder)
  const handleGenerateReport = () => {
    console.log('Generating report for articles:', articles);
    alert('Report generation is not implemented yet. Check the console for article data.');
  };

  // Clear search filters
  const clearSearch = () => {
    setSearchAuthor('');
    setSearchDate('');
    setSearchCategory('');
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Article Dashboard</h2>
        <div className="flex space-x-4">
          <Link to="/articles/add">
            <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all transform duration-500 ease-in-out hover:scale-105 hover:opacity-90">
              Add Article
            </button>
          </Link>
          <button
            onClick={handleGenerateReport}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by author..."
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
          className="border border-gray-300 px-6 py-3 w-full sm:w-96 lg:w-1/4 xl:w-1/5 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-500 text-lg text-gray-800 transition-all duration-300 ease-in-out"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-gray-300 px-6 py-3 w-full sm:w-96 lg:w-1/4 xl:w-1/5 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-500 text-lg text-gray-800 transition-all duration-300 ease-in-out"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-gray-300 px-6 py-3 w-full sm:w-96 lg:w-1/4 xl:w-1/5 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-lg text-gray-800 transition-all duration-300 ease-in-out"
        >
          <option value="">Select Category</option>
          <option value="technology">Technology</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="science">Science</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="environment">Environment</option>
          <option value="history">History</option>
          <option value="self-help">Self-Help</option>
        </select>
        <button
          onClick={clearSearch}
          className="bg-gray-500 text-white px-6 py-3 rounded-xl transition-all transform duration-300 ease-in-out hover:scale-105 hover:bg-gray-600"
        >
          Clear Search
        </button>
      </div>

      {/* Display Articles in Grid Layout */}
      <div className="mt-6">
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-4 rounded-lg shadow-md transform transition duration-500 hover:scale-105 hover:shadow-xl"
              >
                {article.imageUrl ? (
                  <img
                    src={`http://localhost:5185${article.imageUrl}`}
                    alt={article.title}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="text-lg font-semibold mt-2 text-gray-800">{article.title}</h3>
                <p className="text-gray-600 text-sm">By {article.author}</p>
                <p className="text-gray-500 text-xs">
                  {article.category} - {new Date(article.publicationDate).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-600">{article.content.substring(0, 80)}...</p>
                <p className="text-xs text-gray-500 mt-2">Article ID: {article.id}</p>
                <div className="flex gap-2 mt-3">
                  <Link to={`/articles/update/${article.id}`}>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded transition-all transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded transition-all transform duration-300 ease-in-out hover:scale-105 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No articles found.</p>
        )}
      </div>
    </div>
  );
}

export default ArticleList;