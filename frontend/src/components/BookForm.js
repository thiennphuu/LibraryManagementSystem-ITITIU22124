import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ book, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    publishedYear: '',
    publisher: '',
    coverImage: '',
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
        description: book.description || '',
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1,
        publishedYear: book.publishedYear || '',
        publisher: book.publisher || '',
        coverImage: book.coverImage || '',
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
    if (formData.totalCopies < 1) newErrors.totalCopies = 'Must have at least 1 copy';
    if (formData.availableCopies > formData.totalCopies) {
      newErrors.availableCopies = 'Cannot exceed total copies';
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

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter book description"
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="totalCopies">Total Copies *</label>
          <input
            type="number"
            id="totalCopies"
            name="totalCopies"
            value={formData.totalCopies}
            onChange={handleChange}
            min={1}
          />
          {errors.totalCopies && <span className="form-error">{errors.totalCopies}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="availableCopies">Available Copies</label>
          <input
            type="number"
            id="availableCopies"
            name="availableCopies"
            value={formData.availableCopies}
            onChange={handleChange}
            min={0}
            max={formData.totalCopies}
          />
          {errors.availableCopies && <span className="form-error">{errors.availableCopies}</span>}
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

        <div className="form-group">
          <label htmlFor="publisher">Publisher</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Enter publisher name"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="coverImage">Cover Image URL</label>
        <input
          type="url"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
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
