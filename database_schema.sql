-- ========================================
-- Library Management System Database Schema
-- Database: library_management_ititiu22124
-- ========================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS borrow_records;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- ========================================
-- TABLE 1: users
-- ========================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLE 2: books
-- ========================================
CREATE TABLE books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100),
    published_year INT,
    copies_total INT NOT NULL,
    copies_available INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLE 3: borrow_records
-- ========================================
CREATE TABLE borrow_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('BORROWED', 'RETURNED') DEFAULT 'BORROWED',

    CONSTRAINT fk_borrow_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_borrow_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE
);

-- ========================================
-- TABLE 4: reservations
-- ========================================
CREATE TABLE reservations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'READY', 'CANCELLED') DEFAULT 'PENDING',

    CONSTRAINT fk_res_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_res_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE
);

-- ========================================
-- Sample Data (Optional)
-- ========================================

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john@example.com', 'password123', 'USER'),
('Jane Smith', 'jane@example.com', 'password123', 'USER'),
('Admin User', 'admin@example.com', 'admin123', 'ADMIN');

-- Insert sample books
INSERT INTO books (title, author, isbn, category, published_year, copies_total, copies_available) VALUES
('Clean Code', 'Robert C. Martin', '978-0132350884', 'Programming', 2008, 5, 5),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 'Programming', 1999, 3, 3),
('Design Patterns', 'Gang of Four', '978-0201633612', 'Software Engineering', 1994, 2, 2),
('Refactoring', 'Martin Fowler', '978-0134757599', 'Programming', 2018, 4, 4),
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'Computer Science', 2009, 3, 3);

-- ========================================
-- Verification Queries
-- ========================================

-- Show all tables
SHOW TABLES;

-- Verify users table
SELECT * FROM users;

-- Verify books table
SELECT * FROM books;

-- Check table structures
DESCRIBE users;
DESCRIBE books;
DESCRIBE borrow_records;
DESCRIBE reservations;
