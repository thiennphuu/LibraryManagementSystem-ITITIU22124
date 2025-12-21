# 📚 Library Management System

---

## ✨ Overview
A **full‑stack Library Management System** built with **Spring Boot**, **MySQL**, and a modern **React/Vite** frontend. It supports user registration, authentication, book catalog browsing, borrowing/returning, and admin management.

---

## 🛠️ Tech Stack
- **Backend**: Java 17, Spring Boot, Spring Security, JPA/Hibernate, MySQL
- **Frontend**: Vite + React, TypeScript, TailwindCSS (optional), Axios
- **Build & Dev**: Maven, Node.js, npm
- **Testing**: JUnit, Mockito, React Testing Library

---

## 🚀 Quick Start
```bash
# Clone the repo
git clone <repo-url>
cd Library-Management-ITITIU22124

# Backend
./mvnw clean install
java -jar target/*.jar   # runs on http://localhost:8080

# Frontend
cd frontend
npm install
npm run dev               # runs on http://localhost:3000
```

---

## 📂 Project Structure
```
src/main/java/com/example/Library/Management/ITITIU22124/
│   ├─ controller/      # REST controllers
│   ├─ service/         # Business logic
│   ├─ repository/      # JPA repositories
│   ├─ dto/             # Data Transfer Objects
│   └─ mapper/          # MyBatis/MapStruct mappers
frontend/
│   ├─ src/            # React components & pages
│   └─ public/         # Static assets
```

---

## 📖 Features
- **User Management** – Register, login, role‑based access (admin / user).
- **Book Catalog** – List, search, pagination, sorting.
- **Borrowing System** – Borrow, return, overdue tracking.
- **Admin Dashboard** – Statistics, CRUD for books & users.
- **API Documentation** – Swagger UI available at `/swagger-ui.html`.

---

## 🧪 Testing
```bash
# Backend tests
./mvnw test
# Frontend tests
npm run test
```

---

## 📦 Deployment
The application can be containerised with Docker:
```dockerfile
# Dockerfile (backend)
FROM eclipse-temurin:17-jdk-alpine
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```
```bash
# Build & run
docker build -t library-backend .
docker run -p 8080:8080 library-backend
```

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📜 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Generated on 2025‑12‑21*
