import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import userApi from '../services/userApi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await userApi.logout();
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          📚 Library Management
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link to="/books">Books</Link>
          </li>

          {isAuthenticated() ? (
            <>
              <li>
                <Link to="/borrowed">My Books</Link>
              </li>
              <li>
                <Link to="/reservations">Reservations</Link>
              </li>
              <li>
                <Link to="/fines">Fines</Link>
              </li>
              {isAdmin() && (
                <li>
                  <Link to="/admin" className="admin-link">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li className="user-menu">
                <Link to="/profile" className="user-profile">
                  👤 {user?.name || user?.email}
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
