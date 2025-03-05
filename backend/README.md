# Go Backend for Project Management Application

![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=json-web-tokens)

## 📋 Overview

This is the backend component of the Project Management Application, built with Go. It provides a RESTful API for managing projects, tasks, and user authentication.

## 🧠 Learning Experience

Building this backend was my first major project using Go. Through this project, I:

- Learned Go fundamentals and idiomatic Go programming
- Implemented a clean architecture with separation of concerns
- Gained experience with SQL and database operations in Go
- Implemented JWT authentication from scratch
- Developed RESTful API design principles
- Practiced error handling and logging in a production-ready application

## 🛠️ Technologies Used

- **Go**: Core programming language
- **Gorilla Mux**: HTTP router and URL matcher
- **PostgreSQL**: Relational database
- **JWT**: Authentication mechanism
- **CORS**: Cross-Origin Resource Sharing handling
- **Docker**: Containerization for deployment

## 📁 Project Structure

```
backend/
├── config/             # Configuration settings
├── controllers/        # Request handlers
├── middleware/         # Middleware functions
├── models/             # Data models and database operations
├── routes/             # API route definitions
├── utils/              # Utility functions
├── .env                # Environment variables
├── go.mod              # Go module file
├── main.go             # Main application entry point
└── schema.sql          # Database schema
```

## 🚀 Getting Started

### Prerequisites

- [Go](https://golang.org/dl/) (version 1.21 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (version 14 or higher)

### Manual Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE project_management;
   ```

2. Apply the database schema:
   ```bash
   psql -d project_management -f schema.sql
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=8080
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=project_management
   JWT_KEY=your-super-secret-key-change-in-production
   ```

4. Download dependencies and run the application:
   ```bash
   go mod tidy
   go run main.go
   ```

   The backend server will start on http://localhost:8080.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "example",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- `POST /api/auth/login` - Login and get JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

### Projects
- `GET /api/projects` - Get all projects for the authenticated user
- `POST /api/projects` - Create a new project
  ```json
  {
    "name": "Project Name",
    "description": "Project Description"
  }
  ```
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated Description"
  }
  ```
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/projects/:projectId/tasks` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "status": "pending",
    "priority": "medium",
    "project_id": "project-uuid",
    "assignee_id": "user-uuid",
    "due_date": "2025-12-31T00:00:00Z"
  }
  ```
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
  ```json
  {
    "title": "Updated Task Title",
    "status": "in_progress"
  }
  ```
- `DELETE /api/tasks/:id` - Delete a task

## 🧪 Testing

Run the tests with:

```bash
go test ./...
```

## 📝 Key Learnings from Go Development

### 1. Go's Concurrency Model
- Implemented goroutines for concurrent operations
- Used channels for communication between goroutines
- Learned proper error handling in concurrent code

### 2. Database Operations
- Structured SQL queries with proper parameterization
- Implemented transactions for data integrity
- Created efficient database models and relationships

### 3. Authentication & Security
- Implemented JWT token generation and validation
- Created middleware for protecting routes
- Implemented password hashing with bcrypt

### 4. API Design
- Designed RESTful endpoints following best practices
- Implemented proper HTTP status codes and responses
- Created middleware for logging, authentication, and CORS

### 5. Error Handling
- Developed a consistent error handling strategy
- Implemented proper logging for debugging
- Created user-friendly error responses

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- Authentication is handled via JWT tokens
- Input validation is performed on all endpoints
- Database queries are parameterized to prevent SQL injection
- CORS is configured to allow only specific origins

## 🚧 Future Improvements

- Implement unit and integration tests
- Add WebSocket support for real-time updates
- Implement rate limiting for API endpoints
- Add caching for frequently accessed data
- Implement refresh tokens for better security
