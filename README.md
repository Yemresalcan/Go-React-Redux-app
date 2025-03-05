# Go-React-Redux Project Management Application

![Project Management App](https://img.shields.io/badge/Project%20Management-App-blue)
![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

A full-stack project management application with a Go backend and React Redux frontend. This application provides a comprehensive solution for managing projects and tasks with user authentication, role-based access control, and multilingual support.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Project Management**: Create, view, update, and delete projects
- **Task Management**: Manage tasks with priorities, statuses, and due dates
- **Role-Based Access Control**: Different permission levels for users
- **Multilingual Support**: English and Turkish language options
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker Compose

## Project Structure

```
go-react-redux-app/
├── backend/                # Go backend
│   ├── config/             # Configuration settings
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Middleware functions
│   ├── models/             # Data models and database operations
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   ├── go.mod              # Go module file
│   ├── main.go             # Main application entry point
│   └── schema.sql          # Database schema
└── frontend/               # React Redux frontend
    ├── public/             # Static files
    └── src/                # React source code
        ├── components/     # React components
        ├── i18n/           # Internationalization
        ├── pages/          # Page components
        └── redux/          # Redux store and slices
```

## Getting Started

### Prerequisites

- [Go](https://golang.org/dl/) (version 1.21 or higher)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (version 14 or higher)
- [Docker](https://www.docker.com/products/docker-desktop/) (optional, for containerized setup)

### Running with Docker (Recommended)

The easiest way to run the application is using Docker Compose, which requires no local setup other than Docker itself.

1. Clone the repository:
   ```bash
   git clone https://github.com/Yemresalcan/Go-React-Redux-app.git
   cd Go-React-Redux-app
   ```

2. Start all services with Docker Compose:
   ```bash
   docker-compose up -d
   ```

   This command will automatically set up:
   - PostgreSQL database
   - Go backend API
   - React frontend application

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432 (username: postgres, password: postgres)

4. To stop the services:
   ```bash
   docker-compose down
   ```

5. To completely remove the database data:
   ```bash
   docker-compose down -v
   ```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE project_management;
   ```

3. Apply the database schema:
   ```bash
   psql -d project_management -f schema.sql
   ```

4. Create a `.env` file with the following variables:
   ```
   PORT=8080
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=project_management
   JWT_KEY=your-super-secret-key-change-in-production
   ```

5. Download dependencies and run the application:
   ```bash
   go mod tidy
   go run main.go
   ```

   The backend server will start on http://localhost:8080.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend development server will start on http://localhost:3000.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Projects
- `GET /api/projects` - Get all projects for the authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/projects/:projectId/tasks` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Technologies Used

### Backend
- **Go**: Core programming language
- **Gorilla Mux**: HTTP router and URL matcher
- **PostgreSQL**: Relational database
- **JWT**: Authentication mechanism
- **CORS**: Cross-Origin Resource Sharing handling

### Frontend
- **React**: UI library
- **Redux & Redux Toolkit**: State management
- **Material-UI**: Component library
- **i18next**: Internationalization
- **Formik & Yup**: Form handling and validation
- **Axios**: HTTP client
- **React Router**: Navigation

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- HTTPS support (when deployed with proper certificates)

## Multilingual Support

The application supports multiple languages:
- English (default)
- Turkish

Language can be changed using the language switcher in the application header.

## Testing

### Backend Tests
```bash
cd backend
go test ./...
```

### Frontend Tests
```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Yemre Salcan - [GitHub](https://github.com/Yemresalcan)

Project Link: [https://github.com/Yemresalcan/Go-React-Redux-app](https://github.com/Yemresalcan/Go-React-Redux-app)
