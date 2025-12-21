import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import BookSearchBar from '../components/BookSearchBar';
import bookApi from '../services/bookApi';
import './BookListPage.css';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookApi.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({ query, category, availability }) => {
    setLoading(true);
    try {
      if (query) {
        const data = await bookApi.searchBooks(query);
        let results = data;
        if (category) {
          results = results.filter((book) => book.category === category);
        }
        if (availability === 'available') {
          results = results.filter((book) => book.copiesAvailable > 0);
        } else if (availability === 'unavailable') {
          results = results.filter((book) => book.copiesAvailable === 0);
        }
        setFilteredBooks(results);
      } else {
        // No query, just filter existing books
        let results = books;
        if (category) {
          results = results.filter((book) => book.category === category);
        }
        if (availability === 'available') {
          results = results.filter((book) => book.copiesAvailable > 0);
        } else if (availability === 'unavailable') {
          results = results.filter((book) => book.copiesAvailable === 0);
        }
        setFilteredBooks(results);
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = ({ category, availability }) => {
    let results = books;
    if (category) {
      results = results.filter((book) => book.category === category);
    }
    if (availability === 'available') {
      results = results.filter((book) => book.copiesAvailable > 0);
    } else if (availability === 'unavailable') {
      results = results.filter((book) => book.copiesAvailable === 0);
    }
    setFilteredBooks(results);
  };

  if (loading && books.length === 0) {
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

  return (
    <div className="page book-list-page">
      <div className="container">
        <div className="page-header">
          <h1>📚 Book Collection</h1>
          <p>Browse our extensive library collection</p>
        </div>

        <BookSearchBar onSearch={handleSearch} onFilter={handleFilter} />

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={fetchBooks} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
              Retry
            </button>
          </div>
        )}

        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <h3>No books found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="results-count">{filteredBooks.length} books found</p>
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
