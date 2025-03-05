import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
// Import i18n configuration
import './i18n/i18n';

// Token'ı localStorage'dan alıp axios headers'a ekleyelim
const token = localStorage.getItem('token');
if (token) {
  try {
    // Token'ın geçerli olup olmadığını kontrol edelim
    const decoded = jwt_decode(token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    
    if (Date.now() < expirationTime) {
      // Token geçerli, headers'a ekleyelim
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('index.js - Token set in headers:', `Bearer ${token}`);
    } else {
      // Token süresi dolmuş, localStorage'dan temizleyelim
      console.log('index.js - Token expired, removing from localStorage');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    // Token geçersiz, localStorage'dan temizleyelim
    console.error('index.js - Invalid token:', error);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
