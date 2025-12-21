import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import borrowApi from '../services/borrowApi';
import { toast } from 'react-toastify';

const BorrowButton = ({ book, onBorrowSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    if (!isAuthenticated()) {
      toast.info('Please login to borrow books');
      navigate('/login');
      return;
    }

    if (book.copiesAvailable <= 0) {
      toast.warning('This book is not available for borrowing');
      return;
    }

    setLoading(true);
    try {
      const borrowData = {
        userId: user.userId,
        bookId: book.id,
      };
      await borrowApi.borrowBook(borrowData);
      toast.success(`Successfully borrowed "${book.title}"`);
      if (onBorrowSuccess) onBorrowSuccess();
    } catch (error) {
      // Error already handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  const isAvailable = book.copiesAvailable > 0;

  return (
    <button
      onClick={handleBorrow}
      disabled={loading || !isAvailable}
      className={`btn ${isAvailable ? 'btn-success' : 'btn-secondary'}`}
      style={{ width: '100%' }}
    >
      {loading ? 'Processing...' : isAvailable ? '📖 Borrow Book' : 'Not Available'}
    </button>
  );
};

export default BorrowButton;
