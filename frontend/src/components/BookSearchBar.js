import React, { useState } from 'react';
import './BookSearchBar.css';

const BookSearchBar = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Technology',
    'History',
    'Biography',
    'Fantasy',
    'Mystery',
    'Romance',
    'Self-Help',
    'Children',
    'Other',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query, category, availability });
  };

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setAvailability('');
    onSearch({ query: '', category: '', availability: '' });
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary search-btn">
            🔍 Search
          </button>
        </div>

        <div className="search-filters">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (onFilter) onFilter({ category: e.target.value, availability });
            }}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value);
              if (onFilter) onFilter({ category, availability: e.target.value });
            }}
            className="filter-select"
          >
            <option value="">All Availability</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {(query || category || availability) && (
            <button type="button" onClick={handleReset} className="btn btn-secondary reset-btn">
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookSearchBar;
