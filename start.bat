@echo off
REM Library Management System - Quick Start Script
REM This script helps you quickly start the application

echo ========================================
echo Library Management System
echo Quick Start Script
echo ========================================
echo.

REM Check if Java is installed
echo [1/4] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 21 or higher
    echo Download from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)
echo Java found!
echo.

REM Check if MySQL is running (optional)
echo [2/4] Checking MySQL connection...
mysql -u root -proot -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL connection failed
    echo Make sure MySQL is running and credentials are correct
    echo You can continue with H2 database for development
    echo.
) else (
    echo MySQL is running!
    echo.
    
    REM Create database if it doesn't exist
    echo Creating database if not exists...
    mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS library_management_ITITIU22124;" >nul 2>&1
    echo Database ready!
    echo.
)

REM Build the project
echo [3/4] Building the project...
echo This may take a few minutes on first run...
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Build successful!
echo.

REM Run the application
echo [4/4] Starting the application...
echo.
echo ========================================
echo Application is starting...
echo API will be available at:
echo   http://localhost:8080/api/books
echo   http://localhost:8080/api/users
echo   http://localhost:8080/api/borrow
echo   http://localhost:8080/api/reservations
echo.
echo Press Ctrl+C to stop the application
echo ========================================
echo.

call mvnw.cmd spring-boot:run
