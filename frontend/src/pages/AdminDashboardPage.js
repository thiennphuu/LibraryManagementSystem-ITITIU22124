import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookForm from '../components/BookForm';
import bookApi from '../services/bookApi';
import userApi from '../services/userApi';
import borrowApi from '../services/borrowApi';
import reservationApi from '../services/reservationApi';
import adminApi from '../services/adminApi';
import { formatDate } from '../utils/errorHandler';
import { toast } from 'react-toastify';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const editBookId = searchParams.get('edit');

  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Book form state
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
    if (activeTab === 'books') {
      adminApi.getStats().then(setStats).catch(() => setStats(null));
    }
  }, [activeTab]);

  useEffect(() => {
    if (editBookId) {
      handleEditBook(editBookId);
    }
  }, [editBookId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'books':
          const booksData = await bookApi.getAllBooks();
          setBooks(booksData);
          break;
        case 'users':
          const usersData = await userApi.getAllUsers();
          setUsers(usersData);
          break;
        case 'borrows':
          const borrowsData = await borrowApi.getAllBorrows();
          setBorrows(borrowsData);
          break;
        case 'reservations':
          const reservationsData = await reservationApi.getAllReservations();
          setReservations(reservationsData);
          break;
      }
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  // Book handlers
  const handleAddBook = () => {
    setEditingBook(null);
    setShowBookForm(true);
  };

  const handleEditBook = async (bookId) => {
    try {
      const book = await bookApi.getBookById(bookId);
      setEditingBook(book);
      setShowBookForm(true);
      setActiveTab('books');
    } catch (error) {
      // Error handled
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookApi.deleteBook(bookId);
      toast.success('Book deleted successfully');
      fetchData();
    } catch (error) {
      // Error handled
    }
  };

  const handleBookSubmit = async (bookData) => {
    setFormLoading(true);
    try {
      if (editingBook) {
        await bookApi.updateBook(editingBook.id, bookData);
        toast.success('Book updated successfully');
      } else {
        await bookApi.createBook(bookData);
        toast.success('Book added successfully');
      }
      setShowBookForm(false);
      setEditingBook(null);
      fetchData();
    } catch (error) {
      // Error handled
    } finally {
      setFormLoading(false);
    }
  };

  // Reservation handlers
  const handleMarkReady = async (reservationId) => {
    try {
      await reservationApi.markAsReady(reservationId);
      toast.success('Reservation marked as ready');
      fetchData();
    } catch (error) {
      // Error handled
    }
  };

  return (
    <div className="page admin-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>🔧 Admin Dashboard</h1>
          <p>Manage books, users, and library operations</p>
          {stats && (
            <div className="admin-stats">
              <div className="stat-card">👥 <b>{stats.totalUsers}</b> Users</div>
              <div className="stat-card">📚 <b>{stats.totalBooks}</b> Books</div>
              <div className="stat-card">📖 <b>{stats.totalBorrows}</b> Borrows</div>
              <div className="stat-card">🔔 <b>{stats.totalReservations}</b> Reservations</div>
              <div className="stat-card">⚠️ <b>{stats.overdueBorrows}</b> Overdue</div>
              <div className="stat-card">💸 <b>{stats.activeFines}</b> Active Fines</div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            📚 Books ({books.length})
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={`tab ${activeTab === 'borrows' ? 'active' : ''}`}
            onClick={() => setActiveTab('borrows')}
          >
            📖 Borrows
          </button>
          <button
            className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            🔔 Reservations
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {/* Books Tab */}
              {activeTab === 'books' && (
                <div className="tab-content">
                  {showBookForm ? (
                    <div className="card">
                      <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                      <BookForm
                        book={editingBook}
                        onSubmit={handleBookSubmit}
                        onCancel={() => {
                          setShowBookForm(false);
                          setEditingBook(null);
                        }}
                        loading={formLoading}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="tab-header">
                        <h2>Book Management</h2>
                        <button onClick={handleAddBook} className="btn btn-primary">
                          ➕ Add New Book
                        </button>
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Available</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {books.map((book) => {
                            console.log('Book row:', book);
                            return (
                              <tr key={book.id}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>
                                <td>{book.copiesAvailable} / {book.copiesTotal}</td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      onClick={() => handleEditBook(book.id)}
                                      className="btn btn-sm btn-secondary"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      onClick={() => handleDeleteBook(book.id)}
                                      className="btn btn-sm btn-danger"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>User Management</h2>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-danger' : 'badge-info'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <span className="badge badge-success">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Borrows Tab */}
              {activeTab === 'borrows' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>Borrow Management</h2>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Book</th>
                        <th>Borrowed</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrows.map((borrow) => (
                        <tr key={borrow.id}>
                          <td>{borrow.user?.name || 'Unknown'}</td>
                          <td>{borrow.book?.title || 'Unknown'}</td>
                          <td>{formatDate(borrow.borrowDate)}</td>
                          <td>{formatDate(borrow.dueDate)}</td>
                          <td>
                            {borrow.returnDate ? (
                              <span className="badge badge-info">Returned</span>
                            ) : new Date(borrow.dueDate) < new Date() ? (
                              <span className="badge badge-danger">Overdue</span>
                            ) : (
                              <span className="badge badge-success">Active</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Reservations Tab */}
              {activeTab === 'reservations' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>Reservation Management</h2>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Book</th>
                        <th>Reserved</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td>{reservation.user?.name || 'Unknown'}</td>
                          <td>{reservation.book?.title || 'Unknown'}</td>
                          <td>{formatDate(reservation.createdAt)}</td>
                          <td>
                            <span className={`badge badge-${
                              reservation.status === 'READY' ? 'success' :
                              reservation.status === 'PENDING' ? 'warning' : 'info'
                            }`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td>
                            {reservation.status === 'PENDING' && (
                              <button
                                onClick={() => handleMarkReady(reservation.id)}
                                className="btn btn-sm btn-success"
                              >
                                ✅ Mark Ready
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
