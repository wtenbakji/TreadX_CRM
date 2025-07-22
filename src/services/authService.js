import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('treadx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('treadx_token');
      localStorage.removeItem('treadx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    // Mock login for demo purposes
    // Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@treadx.com' && password === 'admin123') {
          resolve({
            data: {
              token: 'mock-jwt-token-admin',
              user: {
                id: '1',
                email: 'admin@treadx.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isActive: true
              }
            }
          });
        } else if (email === 'manager@treadx.com' && password === 'manager123') {
          resolve({
            data: {
              token: 'mock-jwt-token-manager',
              user: {
                id: '2',
                email: 'manager@treadx.com',
                firstName: 'Sales',
                lastName: 'Manager',
                role: 'manager',
                isActive: true
              }
            }
          });
        } else if (email === 'sales@treadx.com' && password === 'sales123') {
          resolve({
            data: {
              token: 'mock-jwt-token-sales',
              user: {
                id: '3',
                email: 'sales@treadx.com',
                firstName: 'Sales',
                lastName: 'Rep',
                role: 'sales_rep',
                isActive: true
              }
            }
          });
        } else {
          throw new Error('Invalid credentials');
        }
      }, 1000);
    });
  },

  logout: async () => {
    // Mock logout
    return Promise.resolve();
  },

  refreshToken: async () => {
    // Mock token refresh
    return Promise.resolve({
      data: {
        token: 'new-mock-jwt-token'
      }
    });
  },

  getCurrentUser: async () => {
    // Mock get current user
    const user = localStorage.getItem('treadx_user');
    if (user) {
      return Promise.resolve({
        data: JSON.parse(user)
      });
    }
    throw new Error('No user found');
  }
};

export default api;

