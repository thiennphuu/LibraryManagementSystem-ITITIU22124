import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import BorrowButton from '../components/BorrowButton';
import ReservationButton from '../components/ReservationButton';
import bookApi from '../services/bookApi';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const data = await bookApi.getBookById(id);
      setBook(data);
    } catch (err) {
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowSuccess = () => {
    fetchBook(); // Refresh book data
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookApi.deleteBook(id);
        navigate('/books');
      } catch (err) {
        // Error handled by errorHandler
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="page">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Book Not Found</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>{error || 'The book you are looking for does not exist.'}</p>
            <button onClick={() => navigate('/books')} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Back to Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = book.copiesAvailable > 0;

  return (
    <div className="page book-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="book-detail-card">
          <div className="book-detail-image">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} />
            ) : (
              <div className="book-placeholder-large">
                <span>📖</span>
              </div>
            )}
          </div>

          <div className="book-detail-content">
            <div className="book-header">
              <h1>{book.title}</h1>
              <span className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <p className="book-author">by {book.author}</p>

            {book.category && (
              <span className="book-category-badge">{book.category}</span>
            )}

            <div className="book-meta-grid">
              <div className="meta-item">
                <span className="meta-label">ISBN</span>
                <span className="meta-value">{book.isbn || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Publisher</span>
                <span className="meta-value">{book.publisher || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Published</span>
                <span className="meta-value">{book.publishedYear || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Copies</span>
                <span className="meta-value">{book.copiesAvailable} / {book.copiesTotal}</span>
              </div>
            </div>

            {book.description && (
              <div className="book-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            <div className="book-actions">
              <BorrowButton book={book} onBorrowSuccess={handleBorrowSuccess} />
              <ReservationButton book={book} onReserveSuccess={handleBorrowSuccess} />

              {isAdmin() && (
                <div className="admin-actions">
                  <button
                    onClick={() => navigate(`/admin?edit=${book.id}`)}
                    className="btn btn-secondary"
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={handleDelete} className="btn btn-danger">
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
