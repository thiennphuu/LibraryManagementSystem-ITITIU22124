import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ book, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    copiesTotal: 1,
    copiesAvailable: 1,
    publishedYear: '',
  });

  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || '',
        copiesTotal: book.copiesTotal || 1,
        copiesAvailable: book.copiesAvailable || 1,
        publishedYear: book.publishedYear || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.copiesTotal < 1) newErrors.copiesTotal = 'Must have at least 1 copy';
    if (formData.copiesAvailable > formData.copiesTotal) {
      newErrors.copiesAvailable = 'Cannot exceed total copies';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
          {errors.author && <span className="form-error">{errors.author}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="isbn">ISBN *</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
          />
          {errors.isbn && <span className="form-error">{errors.isbn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="copiesTotal">Total Copies *</label>
          <input
            type="number"
            id="copiesTotal"
            name="copiesTotal"
            value={formData.copiesTotal}
            onChange={handleChange}
            min={1}
          />
          {errors.copiesTotal && <span className="form-error">{errors.copiesTotal}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="copiesAvailable">Available Copies</label>
          <input
            type="number"
            id="copiesAvailable"
            name="copiesAvailable"
            value={formData.copiesAvailable}
            onChange={handleChange}
            min={0}
            max={formData.copiesTotal}
          />
          {errors.copiesAvailable && <span className="form-error">{errors.copiesAvailable}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="publishedYear">Published Year</label>
          <input
            type="number"
            id="publishedYear"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleChange}
            placeholder="e.g., 2023"
            min={1000}
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
