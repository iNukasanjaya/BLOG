import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

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

  // Handle report generation
  const handleGenerateReport = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 10;

    // Add Header
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41); // Gray-900
    doc.text('Article Summary Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 10;

    // Add Overview: Total Articles
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text('Overview', 10, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99); // Gray-600
    doc.text(`Total Articles: ${articles.length}`, 10, yOffset);
    yOffset += 10;

    // Add Detailed Article List
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81); // Gray-700
    doc.text('Article Details List', 10, yOffset);
    yOffset += 10;

    for (const article of articles) {
      if (yOffset > pageHeight - 50) {
        doc.addPage();
        yOffset = 10;
      }

      // Add article image if available
      if (article.imageUrl) {
        try {
          const imgResponse = await fetch(`http://localhost:5185${article.imageUrl}`);
          const imgBlob = await imgResponse.blob();
          const imgBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imgBlob);
          });
          const imgWidth = 30;
          const imgHeight = 30;
          doc.addImage(imgBase64, 'JPEG', 10, yOffset, imgWidth, imgHeight);
          yOffset += imgHeight + 5;
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }

      // Add article details
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55); // Gray-800
      doc.text(`Title: ${article.title}`, 10, yOffset);
      yOffset += 6;
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99); // Gray-600
      doc.text(`Author: ${article.author}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Publication Date: ${new Date(article.publicationDate).toLocaleDateString()}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Category: ${article.category}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Content: ${article.content.substring(0, 100)}${article.content.length > 100 ? '...' : ''}`, 10, yOffset);
      yOffset += 5;
      doc.text(`Created By: ${article.createdBy}`, 10, yOffset);
      yOffset += 10;
    }

    /// Add Footer
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by NewsWebsiteApi | Contact: support@newswebsite.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save the PDF
    doc.save('ArticleReport.pdf');
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
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by author..."
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
          className="border border-gray-300 px-3 py-2 w-full sm:w-64 lg:w-48 xl:w-40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-500 text-sm text-gray-800 transition-all duration-300 ease-in-out"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 w-full sm:w-64 lg:w-48 xl:w-40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 placeholder-gray-500 text-sm text-gray-800 transition-all duration-300 ease-in-out"
        />
        <select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-gray-300 px-3 py-2 w-full sm:w-64 lg:w-48 xl:w-40 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm text-gray-800 transition-all duration-300 ease-in-out"
        >
          <option value="">Select Category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Health">Health</option>
          <option value="Sport">Sport</option>
          <option value="Science">Science</option>
        </select>
        <button
          onClick={clearSearch}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg transition-all transform duration-300 ease-in-out hover:scale-105 hover:bg-gray-600 text-sm"
        >
          Clear
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