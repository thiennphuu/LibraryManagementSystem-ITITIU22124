import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to the Library</h1>
            <p>
              Discover thousands of books, manage your borrowings, and explore
              a world of knowledge at your fingertips.
            </p>
            <div className="hero-buttons">
              <Link to="/books" className="btn btn-primary btn-lg">
                Browse Books
              </Link>
              {!isAuthenticated() && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Vast Collection</h3>
              <p>Access thousands of books across multiple genres and categories.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Easy Search</h3>
              <p>Find books quickly with our powerful search and filter system.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Simple Borrowing</h3>
              <p>Borrow books with just a click and track all your loans.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Reservations</h3>
              <p>Reserve unavailable books and get notified when ready.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {isAuthenticated() && (
        <section className="quick-actions">
          <div className="container">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/books" className="action-card">
                <span className="action-icon">📚</span>
                <span>Browse Books</span>
              </Link>
              <Link to="/borrowed" className="action-card">
                <span className="action-icon">📖</span>
                <span>My Borrowed Books</span>
              </Link>
              <Link to="/reservations" className="action-card">
                <span className="action-icon">🔔</span>
                <span>My Reservations</span>
              </Link>
              <Link to="/profile" className="action-card">
                <span className="action-icon">👤</span>
                <span>My Profile</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Books Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Online Access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
