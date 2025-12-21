import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import UserForm from '../components/UserForm';
import userApi from '../services/userApi';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/errorHandler';
import './UserProfilePage.css';
import Recommendations from '../components/Recommendations';

const UserProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userApi.getCurrentUser();
      setProfileData(data);
    } catch (error) {
      // Use local user data as fallback
      setProfileData(user);
    }
  };

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      const updatedUser = await userApi.updateUser(user.id, formData);
      updateUser(updatedUser);
      setProfileData(updatedUser);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Error handled by errorHandler
    } finally {
      setLoading(false);
    }
  };

  const displayUser = profileData || user;

  return (
    <div className="page user-profile-page">
      <div className="container">
        <div className="page-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-grid">
          <div className="profile-main-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profile Info Card */}
            <div className="card profile-card">
              {editing ? (
                <>
                  <h2>Edit Profile</h2>
                  <UserForm
                    user={displayUser}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(false)}
                    loading={loading}
                  />
                </>
              ) : (
                <>
                  <div className="profile-header">
                    <div className="avatar">
                      {displayUser?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="profile-name">
                      <h2>{displayUser?.name || 'User'}</h2>
                      <span className={`role-badge ${displayUser?.role?.toLowerCase()}`}>
                        {displayUser?.role || 'USER'}
                      </span>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">📧 Email</span>
                      <span className="detail-value">{displayUser?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📱 Phone</span>
                      <span className="detail-value">{displayUser?.phone || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📍 Address</span>
                      <span className="detail-value">{displayUser?.address || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📅 Member Since</span>
                      <span className="detail-value">{formatDate(displayUser?.createdAt)}</span>
                    </div>
                  </div>

                  <button onClick={() => setEditing(true)} className="btn btn-primary">
                    ✏️ Edit Profile
                  </button>
                </>
              )}
            </div>
            <Recommendations userId={displayUser?.id} />
          </div>

          {/* Account Stats */}
          <div className="profile-sidebar">
            <div className="card stats-card">
              <h3>Account Summary</h3>
              <div className="stat-list">
                <div className="stat-row">
                  <span>Books Borrowed</span>
                  <span className="stat-value">{displayUser?.borrowedCount || 0}</span>
                </div>
                <div className="stat-row">
                  <span>Currently Borrowed</span>
                  <span className="stat-value">{displayUser?.currentBorrows || 0}</span>
                </div>
                <div className="stat-row">
                  <span>Active Reservations</span>
                  <span className="stat-value">{displayUser?.reservationCount || 0}</span>
                </div>
                <div className="stat-row">
                  <span>Overdue Books</span>
                  <span className="stat-value danger">{displayUser?.overdueCount || 0}</span>
                </div>
                {displayUser?.unpaidFinesCount > 0 && (
                  <div className="stat-row fines-warning">
                    <span>Unpaid Fines</span>
                    <span className="stat-value danger">
                      {displayUser?.unpaidFinesCount} (${displayUser?.totalUnpaidFines?.toFixed(2) || '0.00'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="card quick-links">
              <h3>Quick Links</h3>
              <a href="/borrowed" className="quick-link">📖 My Borrowed Books</a>
              <a href="/reservations" className="quick-link">🔔 My Reservations</a>
              <a href="/fines" className="quick-link">💰 My Fines</a>
              <a href="/books" className="quick-link">📚 Browse Books</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
