import axios from 'axios';
import Cookies from 'js-cookie';

const APP_CONFIG = {
  API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080'
};

export const setupAxiosInterceptors = () => {
  // Request interceptor to add token to requests
  axios.interceptors.request.use(
    config => {
      const token = Cookies.get('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor for handling authentication errors
  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Handle 401 (Unauthorized) errors
      if (error.response?.status === 401) {
        // Remove tokens
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        
        // Redirect to login
        window.location.href = '/auth/login';
      }

      // Handle token refresh (if your backend supports it)
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get('refreshToken');
          const response = await axios.post(`${APP_CONFIG.API_GATEWAY_URL}/api/auth/refresh`, 
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          // Update tokens
          Cookies.set('token', response.data.token);
          Cookies.set('refreshToken', response.data.refreshToken);

          // Retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};