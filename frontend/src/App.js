import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Components
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Redux
import { logout, setAuthToken } from './redux/slices/authSlice';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();

  // Check token expiration on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('App.js - Token check:', token ? 'Token exists' : 'No token');
    
    if (token) {
      try {
        // Use jwt_decode instead of manual parsing
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        
        console.log('Token expiration:', new Date(expirationTime).toLocaleString());
        console.log('Current time:', new Date().toLocaleString());
        console.log('Token details:', decoded);
        
        if (Date.now() >= expirationTime) {
          // Token expired
          console.log('Token expired, logging out');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          dispatch(logout());
        } else {
          // Token is still valid, set auth token
          console.log('Token valid, setting auth token');
          
          // Ensure Authorization header is set correctly
          const authHeader = `Bearer ${token}`;
          axios.defaults.headers.common['Authorization'] = authHeader;
          console.log('App.js - Set axios default header:', authHeader);
          
          // Set the token in Redux store
          dispatch(setAuthToken(token));
        }
      } catch (error) {
        // Invalid token format
        console.error('Invalid token format:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(logout());
      }
    } else {
      // No token found
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;
