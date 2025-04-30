import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import RelatedContent from './RelatedContent';

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5185/api/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!article) return <div className="text-center text-gray-600">Article not found.</div>;

  return (
    <>
    <Navbar />
    <div className="py-24 px-6 md:px-12">
      <div className='container mx-auto'>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-2">{new Date(article.publicationDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-4 font-semibold"> Published by {article.author}</p>
      {article.imageUrl && (
        <img
          src={`http://localhost:5185${article.imageUrl}`}
          alt={article.title}
          className="w-3/4 h-96 object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-2xl text-gray-700">{article.content}</p>
      </div>
      {/*Related Content Section*/}
      {article.category && <RelatedContent category={article.category} /> }
    </div>
    </>
  );
}

export default ArticleDetails;