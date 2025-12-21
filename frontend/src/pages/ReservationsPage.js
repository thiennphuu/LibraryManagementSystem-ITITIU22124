import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import reservationApi from '../services/reservationApi';
import { formatDate, formatDateTime } from '../utils/errorHandler';
import { toast } from 'react-toastify';
import './ReservationsPage.css';

const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationApi.getMyReservations();
      setReservations(data);
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    setActionLoading(reservationId);
    try {
      await reservationApi.cancelReservation(reservationId);
      toast.success('Reservation cancelled successfully');
      fetchReservations();
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setActionLoading(null);
    }
  };

  const handleFulfill = async (reservationId) => {
    setActionLoading(reservationId);
    try {
      await reservationApi.fulfillReservation(reservationId);
      toast.success('Reservation fulfilled - book has been borrowed!');
      fetchReservations();
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { class: 'badge-warning', label: '⏳ Pending' },
      READY: { class: 'badge-success', label: '✅ Ready for Pickup' },
      FULFILLED: { class: 'badge-info', label: '📖 Fulfilled' },
      CANCELLED: { class: 'badge-secondary', label: '❌ Cancelled' },
      EXPIRED: { class: 'badge-danger', label: '⏰ Expired' },
    };
    const { class: className, label } = statusMap[status] || statusMap.PENDING;
    return <span className={`badge ${className}`}>{label}</span>;
  };

  // Filter reservations by status
  const activeReservations = reservations.filter(
    (r) => r.status === 'PENDING' || r.status === 'READY'
  );
  const pastReservations = reservations.filter(
    (r) => r.status !== 'PENDING' && r.status !== 'READY'
  );

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
    <div className="page reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>🔔 My Reservations</h1>
          <p>View and manage your book reservations</p>
        </div>

        {/* Active Reservations */}
        <section className="reservation-section">
          <h2>Active Reservations ({activeReservations.length})</h2>

          {activeReservations.length === 0 ? (
            <div className="empty-state card">
              <h3>No Active Reservations</h3>
              <p>You don't have any pending reservations.</p>
              <Link to="/books" className="btn btn-primary">Browse Books</Link>
            </div>
          ) : (
            <div className="reservations-grid">
              {activeReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`reservation-card ${reservation.status.toLowerCase()}`}
                >
                  <div className="reservation-header">
                    {getStatusBadge(reservation.status)}
                    {reservation.queuePosition && (
                      <span className="queue-position">
                        Queue: #{reservation.queuePosition}
                      </span>
                    )}
                  </div>

                  <div className="reservation-book">
                    <h3>
                      <Link to={`/books/${reservation.book?.id}`}>
                        {reservation.book?.title || 'Unknown Book'}
                      </Link>
                    </h3>
                    <p>by {reservation.book?.author || 'Unknown'}</p>
                  </div>

                  <div className="reservation-details">
                    <div className="detail-row">
                      <span className="detail-label">Reserved On</span>
                      <span>{formatDateTime(reservation.createdAt)}</span>
                    </div>
                    {reservation.expiresAt && (
                      <div className="detail-row">
                        <span className="detail-label">Expires</span>
                        <span>{formatDateTime(reservation.expiresAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="reservation-actions">
                    {reservation.status === 'READY' && (
                      <button
                        onClick={() => handleFulfill(reservation.id)}
                        disabled={actionLoading === reservation.id}
                        className="btn btn-success"
                      >
                        {actionLoading === reservation.id ? 'Processing...' : '📖 Pick Up Book'}
                      </button>
                    )}
                    {reservation.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        disabled={actionLoading === reservation.id}
                        className="btn btn-danger"
                      >
                        {actionLoading === reservation.id ? 'Cancelling...' : '❌ Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Reservations */}
        {pastReservations.length > 0 && (
          <section className="reservation-section history-section">
            <h2>Reservation History ({pastReservations.length})</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Reserved Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <Link to={`/books/${reservation.book?.id}`}>
                        {reservation.book?.title || 'Unknown'}
                      </Link>
                    </td>
                    <td>{formatDate(reservation.createdAt)}</td>
                    <td>{getStatusBadge(reservation.status)}</td>
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

export default ReservationsPage;
