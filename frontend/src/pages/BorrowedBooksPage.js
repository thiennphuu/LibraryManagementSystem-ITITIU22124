import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import borrowApi from '../services/borrowApi';
import { formatDate, isOverdue, daysUntilDue } from '../utils/errorHandler';
import { toast } from 'react-toastify';
import './BorrowedBooksPage.css';

const BorrowedBooksPage = () => {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const data = await borrowApi.getMyBorrowedBooks();
      setBorrows(data);
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId, bookTitle) => {
    setActionLoading(borrowId);
    try {
      await borrowApi.returnBook(borrowId);
      toast.success(`Successfully returned "${bookTitle}"`);
      fetchBorrowedBooks();
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtend = async (borrowId) => {
    setActionLoading(borrowId);
    try {
      await borrowApi.extendBorrow(borrowId);
      toast.success('Borrow period extended successfully');
      fetchBorrowedBooks();
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (borrow) => {
    if (borrow.returnDate) {
      return <span className="badge badge-info">Returned</span>;
    }
    if (isOverdue(borrow.dueDate)) {
      return <span className="badge badge-danger">Overdue</span>;
    }
    const days = daysUntilDue(borrow.dueDate);
    if (days <= 3) {
      return <span className="badge badge-warning">Due Soon</span>;
    }
    return <span className="badge badge-success">Active</span>;
  };

  // Separate active and returned borrows
  const activeBorrows = borrows.filter((b) => !b.returnDate);
  const returnedBorrows = borrows.filter((b) => b.returnDate);

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

  return (
    <div className="page borrowed-books-page">
      <div className="container">
        <div className="page-header">
          <h1>📖 My Borrowed Books</h1>
          <p>Track your borrowed books and due dates</p>
        </div>

        {/* Active Borrows */}
        <section className="borrow-section">
          <h2>Currently Borrowed ({activeBorrows.length})</h2>
          
          {activeBorrows.length === 0 ? (
            <div className="empty-state card">
              <h3>No Active Borrows</h3>
              <p>You don't have any books borrowed at the moment.</p>
              <a href="/books" className="btn btn-primary">Browse Books</a>
            </div>
          ) : (
            <div className="borrows-list">
              {activeBorrows.map((borrow) => (
                <div key={borrow.id} className={`borrow-card ${isOverdue(borrow.dueDate) ? 'overdue' : ''}`}>
                  <div className="borrow-book-info">
                    <h3>{borrow.book?.title || 'Unknown Book'}</h3>
                    <p className="book-author">by {borrow.book?.author || 'Unknown'}</p>
                    {getStatusBadge(borrow)}
                  </div>
                  
                  <div className="borrow-dates">
                    <div className="date-item">
                      <span className="date-label">Borrowed</span>
                      <span className="date-value">{formatDate(borrow.borrowDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Due Date</span>
                      <span className={`date-value ${isOverdue(borrow.dueDate) ? 'overdue-text' : ''}`}>
                        {formatDate(borrow.dueDate)}
                        {!isOverdue(borrow.dueDate) && (
                          <small> ({daysUntilDue(borrow.dueDate)} days left)</small>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="borrow-actions">
                    <button
                      onClick={() => handleReturn(borrow.id, borrow.book?.title)}
                      disabled={actionLoading === borrow.id}
                      className="btn btn-success"
                    >
                      {actionLoading === borrow.id ? 'Processing...' : '📥 Return Book'}
                    </button>
                    {!isOverdue(borrow.dueDate) && (
                      <button
                        onClick={() => handleExtend(borrow.id)}
                        disabled={actionLoading === borrow.id}
                        className="btn btn-secondary"
                      >
                        ⏰ Extend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Returned Books History */}
        {returnedBorrows.length > 0 && (
          <section className="borrow-section history-section">
            <h2>Borrowing History ({returnedBorrows.length})</h2>
            
            <table className="table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Borrowed Date</th>
                  <th>Returned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {returnedBorrows.map((borrow) => (
                  <tr key={borrow.id}>
                    <td>{borrow.book?.title || 'Unknown'}</td>
                    <td>{borrow.book?.author || 'Unknown'}</td>
                    <td>{formatDate(borrow.borrowDate)}</td>
                    <td>{formatDate(borrow.returnDate)}</td>
                    <td>{getStatusBadge(borrow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooksPage;
