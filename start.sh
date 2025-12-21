#!/bin/bash
# Library Management System - Quick Start Script (Linux/Mac)
# This script helps you quickly start the application

echo "========================================"
echo "Library Management System"
echo "Quick Start Script"
echo "========================================"
echo ""

# Check if Java is installed
echo "[1/4] Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 21 or higher"
    echo "Download from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi
echo "Java found!"
java -version
echo ""

# Check if MySQL is running (optional)
echo "[2/4] Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    mysql -u root -proot -e "SELECT 1;" &> /dev/null
    if [ $? -eq 0 ]; then
        echo "MySQL is running!"
        echo ""
        
        # Create database if it doesn't exist
        echo "Creating database if not exists..."
        mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS library_management_ITITIU22124;" &> /dev/null
        echo "Database ready!"
        echo ""
    else
        echo "WARNING: MySQL connection failed"
        echo "Make sure MySQL is running and credentials are correct"
        echo "You can continue with H2 database for development"
        echo ""
    fi
else
    echo "MySQL not found, skipping database check"
    echo ""
fi

# Build the project
echo "[3/4] Building the project..."
echo "This may take a few minutes on first run..."
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi
echo "Build successful!"
echo ""

# Run the application
echo "[4/4] Starting the application..."
echo ""
echo "========================================"
echo "Application is starting..."
echo "API will be available at:"
echo "  http://localhost:8080/api/books"
echo "  http://localhost:8080/api/users"
echo "  http://localhost:8080/api/borrow"
echo "  http://localhost:8080/api/reservations"
echo ""
echo "Press Ctrl+C to stop the application"
echo "========================================"
echo ""

./mvnw spring-boot:run
