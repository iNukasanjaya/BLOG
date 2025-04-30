import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  // Extract the first sentence of the description
  const getFirstSentence = (text) => {
    if (!text) return '';
    const sentences = text.split('.');
    return sentences[0] ? `${sentences[0]}.` : ''; // Return the first sentence with a period
  };

  // Format the date (assuming article.publicationDate is a string like "2025-04-04T00:00:00")
  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle card click to navigate to ArticleDetails page
  const handleCardClick = () => {
    navigate(`/articledetails/${article.id}`);
  };

  return (
    <div
      className="relative w-80 h-96 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={handleCardClick}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
            article.imageUrl ? `http://localhost:5185${article.imageUrl}` : 'https://via.placeholder.com/320x384?text=No+Image'
          })`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-end p-6">
          {/* Title */}
          <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-md">
            {article.title || 'Untitled Article'}
          </h3>

          {/* PublicationDate */}
          <p className="text-gray-200 text-sm mb-2 drop-shadow-md">
            {formatDate(article.publicationDate)}
          </p>

          {/* First Sentence of Content */}
          <p className="text-gray-100 text-base drop-shadow-md line-clamp-2">
            {getFirstSentence(article.content) || 'No content available.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;