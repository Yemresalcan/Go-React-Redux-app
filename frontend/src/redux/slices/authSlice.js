import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Helper function to set auth token in axios headers
export const setAuthToken = (token) => {
  console.log('setAuthToken called with token:', token ? 'token exists' : 'no token');
  
  if (token) {
    // Set token in localStorage
    localStorage.setItem('token', token);
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set in axios headers:', `Bearer ${token}`);
    
    // Log all current axios headers for debugging
    console.log('Current axios headers:', axios.defaults.headers.common);
    
    return true;
  } else {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    console.log('Auth token removed from axios headers');
    
    return false;
  }
};

// Check if token is valid and not expired
const isTokenValid = (token) => {
  if (!token) {
    console.log('No token provided to isTokenValid');
    return false;
  }
  
  try {
    const decoded = jwt_decode(token);
    const isValid = decoded.exp * 1000 > Date.now();
    console.log('Token validation:', isValid ? 'Valid' : 'Expired', 'Expires:', new Date(decoded.exp * 1000).toLocaleString());
    return isValid;
  } catch (err) {
    console.error("Token validation error:", err);
    return false;
  }
};

// Initialize auth state from localStorage
const token = localStorage.getItem('token');
let user = null;

if (token) {
  console.log('Found token in localStorage');
  if (isTokenValid(token)) {
    console.log('Token is valid, setting in axios headers');
    setAuthToken(token);
    try {
      user = jwt_decode(token);
      console.log('Decoded user from token:', user);
    } catch (err) {
      console.error("Token decode error:", err);
      setAuthToken(null);
    }
  } else {
    console.log('Token is invalid or expired, removing');
    localStorage.removeItem('token');
  }
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Login attempt with:', credentials.username);
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('Login response:', response.data);
      
      // API yanıt yapısını kontrol et
      if (response.data && response.data.success === true) {
        const { token } = response.data.data;
        
        // Token kontrolü
        if (!token) {
          console.error('Token not found in response');
          toast.error('Token not found in response');
          return rejectWithValue('Token not found in response');
        }
        
        // Token'ı decode et ve kontrol et
        try {
          const decoded = jwt_decode(token);
          console.log('Decoded token:', decoded);
          
          // Token'ı localStorage ve axios headers'a ekle
          setAuthToken(token);
          
          // Başarılı login mesajı
          toast.success('Login successful!');
          
          // User bilgisini token'dan al
          const user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role
          };
          
          // Token ve user bilgisini döndür
          return { token, user };
        } catch (error) {
          console.error('Token decode error:', error);
          toast.error('Invalid token format');
          return rejectWithValue('Invalid token format');
        }
      } else {
        // API yanıt yapısı hatalı
        const message = response.data?.error || 'Login failed';
        console.error('Login failed:', message);
        toast.error(message);
        return rejectWithValue(message);
      }
    } catch (error) {
      // API isteği hatası
      console.error('Login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Verify token with backend
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      if (!token) {
        return rejectWithValue('No token available');
      }
      
      // Set token in headers for this request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/auth/verify-token`, config);
      
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data?.error || 'Token verification failed');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return rejectWithValue('Token verification failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token,
    user: user,
    isAuthenticated: !!user,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify Token
      .addCase(verifyToken.fulfilled, (state, action) => {
        // Token is valid, update user info if returned
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyToken.rejected, (state) => {
        // Token verification failed, log out
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        setAuthToken(null);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
