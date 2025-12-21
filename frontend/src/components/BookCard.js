import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { id, title, author, category, copiesAvailable, copiesTotal, isbn, coverImage } = book;

  const isAvailable = copiesAvailable > 0;

  return (
    <div className="book-card">
      <div className="book-card-image">
        {coverImage ? (
          <img src={coverImage} alt={title} />
        ) : (
          <div className="book-placeholder">
            <span>📖</span>
          </div>
        )}
        <span className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="book-card-content">
        <h3 className="book-title">
          <Link to={`/books/${id}`}>{title}</Link>
        </h3>
        <p className="book-author">by {author}</p>
        
        {category && (
          <span className="book-category">{category}</span>
        )}

        <div className="book-meta">
          <span className="copies-info">
            {copiesAvailable} / {copiesTotal} copies
          </span>
          {isbn && <span className="isbn">ISBN: {isbn}</span>}
        </div>
      </div>

      <div className="book-card-actions">
        <Link to={`/books/${id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
