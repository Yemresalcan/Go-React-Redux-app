# Go React Redux Project Management Application

This is a full-stack project management application with a Go backend and React Redux frontend.

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
        └── redux/          # Redux store and slices
```

## Backend (Go)

The backend is a RESTful API built with Go, using PostgreSQL for data storage and JWT for authentication.

### Features

- User authentication with JWT
- Project management (CRUD operations)
- Task management with priorities and statuses
- Role-based access control

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

#### Projects
- `GET /api/projects` - Get all projects for the authenticated user
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

#### Tasks
- `GET /api/projects/:projectId/tasks` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Database Setup

1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE project_management;
   ```

2. Apply the schema:
   ```
   psql -d project_management -f schema.sql
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=project_management
JWT_KEY=your-super-secret-key-change-in-production
```

### Running the Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Download dependencies:
   ```
   go mod tidy
   ```

3. Run the application:
   ```
   go run main.go
   ```

The backend server will start on http://localhost:8080.

## Docker ile Çalıştırma

Projeyi Docker ile çalıştırmak çok daha kolaydır ve herhangi bir yerel kurulum gerektirmez.

### Gereksinimler

- [Docker](https://www.docker.com/products/docker-desktop/) yüklü olmalıdır
- [Docker Compose](https://docs.docker.com/compose/install/) yüklü olmalıdır (Docker Desktop ile birlikte gelir)

### Çalıştırma Adımları

1. Projeyi klonlayın:
   ```
   git clone https://github.com/yourusername/go-react-redux-app.git
   cd go-react-redux-app
   ```

2. Docker Compose ile tüm servisleri başlatın:
   ```
   docker-compose up -d
   ```

Bu komut ile:
- PostgreSQL veritabanı
- Go backend API
- React frontend uygulaması

otomatik olarak kurulacak ve çalışmaya başlayacaktır.

3. Uygulamaya erişim:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432 (kullanıcı adı: postgres, şifre: postgres)

4. Servisleri durdurmak için:
   ```
   docker-compose down
   ```

5. Veritabanı verilerini tamamen silmek için:
   ```
   docker-compose down -v
   ```

## Frontend (React Redux)

The frontend is built with React and Redux, using Redux Toolkit for state management.

### Features

- User authentication
- Project dashboard
- Task management interface
- Responsive design

### Running the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend development server will start on http://localhost:3000.

## Technologies Used

- **Backend**:
  - Go
  - Gorilla Mux for routing
  - PostgreSQL for data storage
  - JWT for authentication
  - CORS handling

- **Frontend**:
  - React
  - Redux & Redux Toolkit
  - Material-UI for components
  - Formik & Yup for form validation
  - Axios for API calls
  - React Router for navigation

## Application Features

### User Management
- User registration and login
- JWT-based authentication
- Profile management

### Project Management
- Create, read, update, and delete projects
- View project details
- Assign tasks to projects

### Task Management
- Create, read, update, and delete tasks
- Filter tasks by status and project
- Task status tracking (Pending, In Progress, Completed)
- Task due date management

## Future Enhancements

- User roles and permissions
- Team collaboration features
- File attachments for tasks and projects
- Email notifications
- Advanced reporting and analytics
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.
