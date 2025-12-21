import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import fineApi from '../services/fineApi';
import { formatDate } from '../utils/errorHandler';
import { toast } from 'react-toastify';
import './FinesPage.css';

const FinesPage = () => {
  const { user } = useAuth();
  const [fines, setFines] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [payingAll, setPayingAll] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unpaid, paid

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const summaryData = await fineApi.getMyFineSummary();
      setSummary(summaryData);
      setFines(summaryData.allFines || []);
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (fineId) => {
    setPayingId(fineId);
    try {
      await fineApi.payFine(fineId);
      toast.success('Fine paid successfully!');
      fetchFines();
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setPayingId(null);
    }
  };

  const handlePayAll = async () => {
    if (!summary || summary.unpaidCount === 0) return;
    
    setPayingAll(true);
    try {
      await fineApi.payAllFines();
      toast.success('All fines paid successfully!');
      fetchFines();
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setPayingAll(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-success">Paid</span>;
      case 'WAIVED':
        return <span className="badge badge-info">Waived</span>;
      case 'UNPAID':
      default:
        return <span className="badge badge-danger">Unpaid</span>;
    }
  };

  const filteredFines = fines.filter(fine => {
    if (filter === 'all') return true;
    if (filter === 'unpaid') return fine.status === 'UNPAID';
    if (filter === 'paid') return fine.status === 'PAID' || fine.status === 'WAIVED';
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
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

  return (
    <div className="page fines-page">
      <div className="container">
        <div className="page-header">
          <h1>💰 My Fines</h1>
          <p>View and manage your library fines</p>
        </div>

        {/* Summary Cards */}
        <div className="fines-summary">
          <div className="summary-card total-unpaid">
            <div className="summary-icon">💵</div>
            <div className="summary-content">
              <span className="summary-label">Total Unpaid</span>
              <span className="summary-value">{formatCurrency(summary?.totalUnpaidAmount)}</span>
            </div>
          </div>
          <div className="summary-card unpaid-count">
            <div className="summary-icon">📋</div>
            <div className="summary-content">
              <span className="summary-label">Unpaid Fines</span>
              <span className="summary-value">{summary?.unpaidCount || 0}</span>
            </div>
          </div>
          <div className="summary-card total-fines">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <span className="summary-label">Total Fines</span>
              <span className="summary-value">{fines.length}</span>
            </div>
          </div>
        </div>

        {/* Pay All Button */}
        {summary?.unpaidCount > 0 && (
          <div className="pay-all-section">
            <button 
              className="btn btn-primary btn-pay-all"
              onClick={handlePayAll}
              disabled={payingAll}
            >
              {payingAll ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                <>
                  💳 Pay All Fines ({formatCurrency(summary?.totalUnpaidAmount)})
                </>
              )}
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({fines.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'unpaid' ? 'active' : ''}`}
            onClick={() => setFilter('unpaid')}
          >
            Unpaid ({fines.filter(f => f.status === 'UNPAID').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
          >
            Paid/Waived ({fines.filter(f => f.status !== 'UNPAID').length})
          </button>
        </div>

        {/* Fines List */}
        {filteredFines.length === 0 ? (
          <div className="empty-state card">
            <h3>🎉 No Fines Found</h3>
            <p>
              {filter === 'all' 
                ? "You don't have any fines. Keep returning books on time!"
                : filter === 'unpaid'
                ? "You don't have any unpaid fines. Great job!"
                : "No paid or waived fines yet."}
            </p>
          </div>
        ) : (
          <div className="fines-list">
            {filteredFines.map(fine => (
              <div key={fine.id} className={`fine-card card ${fine.status.toLowerCase()}`}>
                <div className="fine-header">
                  <div className="fine-book-info">
                    <h3>{fine.borrowRecord?.book?.title || 'Unknown Book'}</h3>
                    <p className="fine-book-author">
                      by {fine.borrowRecord?.book?.author || 'Unknown Author'}
                    </p>
                  </div>
                  <div className="fine-amount">
                    <span className="amount">{formatCurrency(fine.amount)}</span>
                    {getStatusBadge(fine.status)}
                  </div>
                </div>

                <div className="fine-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Due Date</span>
                    <span className="detail-value">{formatDate(fine.dueDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📆 Return Date</span>
                    <span className="detail-value">{formatDate(fine.returnDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⏰ Days Overdue</span>
                    <span className="detail-value overdue">{fine.daysOverdue} days</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💲 Daily Rate</span>
                    <span className="detail-value">{formatCurrency(fine.dailyRate)}/day</span>
                  </div>
                  {fine.paidAt && (
                    <div className="detail-row">
                      <span className="detail-label">✅ Paid On</span>
                      <span className="detail-value">{formatDate(fine.paidAt)}</span>
                    </div>
                  )}
                </div>

                {fine.status === 'UNPAID' && (
                  <div className="fine-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePayFine(fine.id)}
                      disabled={payingId === fine.id}
                    >
                      {payingId === fine.id ? (
                        <>
                          <span className="spinner-small"></span>
                          Processing...
                        </>
                      ) : (
                        <>💳 Pay Fine</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="card info-card">
          <h3>ℹ️ Fine Policy</h3>
          <ul>
            <li>Fines are calculated at <strong>$0.50 per day</strong> for overdue books</li>
            <li>Maximum fine per book is capped at <strong>$25.00</strong></li>
            <li>Fines are automatically calculated when you return overdue books</li>
            <li>Please pay your fines promptly to maintain borrowing privileges</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinesPage;
