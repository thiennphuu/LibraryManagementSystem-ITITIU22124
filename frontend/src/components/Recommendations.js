import React, { useEffect, useState } from 'react';
import recommendationApi from '../services/recommendationApi';
import './Recommendations.css';
import { Link } from 'react-router-dom';

const Recommendations = ({ userId }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        recommendationApi.getRecommendations(userId)
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load recommendations", err);
                setBooks([]); // Ensure books is empty on error
                setLoading(false);
            });
    }, [userId]);

    if (loading) return null;

    if (!books || books.length === 0) {
        return (
            <section className="recommendations-container">
                <h3>📚 Recommended for You</h3>
                <p style={{ color: '#666', fontStyle: 'italic' }}>Borrow some books to get personalized recommendations!</p>
            </section>
        );
    }

    return (
        <section className="recommendations-container">
            <h3>📚 Recommended for You</h3>
            <div className="recommendations-grid">
                {books.map((book) => (
                    <Link to={`/books/${book.id}`} key={book.id} className="recommendation-card">
                        <div className="book-cover-placeholder">
                            {book.title.charAt(0)}
                        </div>
                        <div className="book-info">
                            <h4 className="book-title">{book.title}</h4>
                            <p className="book-author">{book.author}</p>
                            <span className="book-category">{book.category}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Recommendations;
