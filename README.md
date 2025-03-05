# Go-React-Redux Project Management Application

![Project Management App](https://img.shields.io/badge/Project%20Management-App-blue)
![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

## 📋 Project Overview

A full-stack project management application with a Go backend and React Redux frontend. This application provides a comprehensive solution for managing projects and tasks with user authentication, role-based access control, and multilingual support.

> **Learning Journey**: This project represents my journey of learning Go and enhancing my React/Redux skills. I built it from scratch to understand full-stack development with these technologies, implementing best practices and modern patterns along the way.

### Demo

[Live Demo](https://github.com/Yemresalcan/Go-React-Redux-app) | [Video Walkthrough](https://github.com/Yemresalcan/Go-React-Redux-app)

## 🌟 Key Features

- **User Authentication**: Secure JWT-based authentication system
- **Project Management**: Create, view, update, and delete projects
- **Task Management**: Manage tasks with priorities, statuses, and due dates
- **Role-Based Access Control**: Different permission levels for users
- **Multilingual Support**: English and Turkish language options
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker Compose

## 💻 Technologies Used

### Backend
- **Go**: Core programming language for building the RESTful API
- **Gorilla Mux**: HTTP router and URL matcher for routing API endpoints
- **PostgreSQL**: Relational database for data persistence
- **JWT**: Authentication mechanism for secure user sessions
- **CORS**: Cross-Origin Resource Sharing handling
- **Docker**: Containerization for easy deployment

### Frontend
- **React**: UI library for building the user interface
- **Redux & Redux Toolkit**: State management for complex application state
- **Material-UI**: Component library for modern, responsive design
- **i18next**: Internationalization for multilingual support
- **Formik & Yup**: Form handling and validation
- **Axios**: HTTP client for API communication
- **React Router**: Navigation and routing

## 🧠 What I Learned

### Go Development
- Building RESTful APIs with Go
- Implementing middleware for authentication and logging
- Database operations with PostgreSQL in Go
- Error handling and logging best practices
- Structuring a Go application for maintainability
- JWT implementation for secure authentication

### React & Redux Development
- Advanced Redux patterns with Redux Toolkit
- Creating reusable React components
- Form handling with Formik and Yup
- Implementing internationalization (i18n)
- Material-UI theming and customization
- Responsive design principles

### Full-Stack Skills
- Docker containerization for both frontend and backend
- CI/CD workflow setup
- Database design and normalization
- API design and documentation
- Security best practices
- Testing strategies

## 🏗️ Project Structure

```
go-react-redux-app/
├── backend/                # Go backend
│   ├── config/             # Configuration settings
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Middleware functions
│   ├── models/             # Data models and database operations
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions
│   ├── README.md           # Backend-specific documentation
│   ├── .env                # Environment variables
│   ├── go.mod              # Go module file
│   ├── main.go             # Main application entry point
│   └── schema.sql          # Database schema
└── frontend/               # React Redux frontend
    ├── public/             # Static files
    ├── README.md           # Frontend-specific documentation
    └── src/                # React source code
        ├── components/     # React components
        ├── i18n/           # Internationalization
        ├── pages/          # Page components
        └── redux/          # Redux store and slices
```

## 🚀 Getting Started

See detailed setup instructions in the [backend README](./backend/README.md) and [frontend README](./frontend/README.md).

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/Yemresalcan/Go-React-Redux-app.git
cd Go-React-Redux-app

# Start all services with Docker Compose
docker-compose up -d

# Access the application at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

## 🔌 API Endpoints

See the [backend README](./backend/README.md) for detailed API documentation.

## 🌐 Multilingual Support

The application supports multiple languages:
- English (default)
- Turkish

Language can be changed using the language switcher in the application header.

## 🧪 Testing

See testing instructions in the respective README files for [backend](./backend/README.md) and [frontend](./frontend/README.md).

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- HTTPS support (when deployed with proper certificates)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

Yemre Salcan - [GitHub](https://github.com/Yemresalcan) - [LinkedIn](https://www.linkedin.com/in/yemresalcan/)

Project Link: [https://github.com/Yemresalcan/Go-React-Redux-app](https://github.com/Yemresalcan/Go-React-Redux-app)
