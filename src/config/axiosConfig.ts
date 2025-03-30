import axios from 'axios';

// Create axios instance configured for Spring Boot backend
export const springAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Initialize interceptors immediately
export function setupAxiosInterceptors() {
  // Request interceptor for auth headers
  springAxios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.debug('Injecting auth token for request to:', config.url);
      }
      return config;
    },
    error => Promise.reject(error)
  );

  springAxios.interceptors.response.use(
    response => response,
    async error => {
      console.error('Axios response error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error:', error.message);
        alert('Cannot connect to server. Please check your network connection.');
      }

      if (error.response?.status === 401) {
        // Clear all auth related items and session data
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to login without browser intervention
        window.location.href = '/auth/login';
        return Promise.resolve(); // Prevent error propagation and browser dialog
      }
      return Promise.reject(error);
    }
  );
}
