import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import reservationApi from '../services/reservationApi';
import { toast } from 'react-toastify';

const ReservationButton = ({ book, onReserveSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (!isAuthenticated()) {
      toast.info('Please login to reserve books');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const reservationData = {
        userId: user.userId,
        bookId: book.id,
      };
      const response = await reservationApi.createReservation(reservationData);
      toast.success(`Reserved "${book.title}". Queue position: ${response.queuePosition || 'N/A'}`);
      if (onReserveSuccess) onReserveSuccess(response);
    } catch (error) {
      // Error already handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  // Show reserve button only when book is unavailable
  if (book.copiesAvailable > 0) {
    return null;
  }

  return (
    <button
      onClick={handleReserve}
      disabled={loading}
      className="btn btn-warning"
      style={{ width: '100%', marginTop: '10px' }}
    >
      {loading ? 'Processing...' : '🔔 Reserve Book'}
    </button>
  );
};

export default ReservationButton;
