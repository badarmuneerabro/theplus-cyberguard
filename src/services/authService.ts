import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from '../config/apiConfig';

// Create a simpler axios instance with longer timeout
const registerAxios = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Original springAxios import (if you're importing it from elsewhere)
import { springAxios } from '../config/axiosConfig';

// Type definitions
interface LoginResponse {
  data: {
    token: string;
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

// Used for typing the registration response
type RegisterResponse = {
  token?: string;
  user?: any;
  message?: string;
};

interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

// Used for typing the 2FA verification response
type Verify2FAResponse = {
  data: {
    token: string;
  };
};

// Used for typing the 2FA disable response
type Disable2FAResponse = {
  data: {
    message: string;
  };
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store tokens
    if (data.data?.accessToken) {
      Cookies.set('authToken', data.data.accessToken);
      Cookies.set('refreshToken', data.data.refreshToken);
      localStorage.setItem('authToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
    }
    
    return data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const register = async (firstName: string, lastName: string, email: string, password: string): Promise<RegisterResponse> => {
  console.log('Attempting registration with API endpoint:', 
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`);
  
  try {
    // First, try the fetch API which may be more reliable for cross-domain requests
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (fetchError) {
    console.error("Fetch registration attempt failed, trying axios:", fetchError);
    
    // Fall back to axios if fetch fails
    try {
      const axiosResponse = await registerAxios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        { firstName, lastName, email, password }
      );
      return axiosResponse.data;
    } catch (axiosError) {
      console.error("Axios registration failed:", axiosError);
      
      // Try one more direct approach to the auth-service
      try {
        const directResponse = await fetch(`http://localhost:8081${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
        
        if (!directResponse.ok) {
          const errorData = await directResponse.json();
          throw new Error(errorData.message || 'Direct registration failed');
        }
        
        return await directResponse.json();
      } catch (directError) {
        console.error("Direct registration failed:", directError);
        throw directError;
      }
    }
  }
};


export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await springAxios.post<LoginResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      { refreshToken }
    );
    return response.data;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
};

export const setup2FA = async (authToken: string) => {
  try {
    const response = await springAxios.post<TwoFactorSetupResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SETUP_2FA}`,
      null,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("2FA setup failed", error);
    throw error;
  }
};

export const verify2FA = async (authToken: string, code: string) => {
  try {
    await springAxios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_2FA}`,
      { code },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return true;
  } catch (error) {
    console.error("2FA verification failed", error);
    throw error;
  }
};

export const disable2FA = async (authToken: string, code: string) => {
  try {
    await springAxios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.DISABLE_2FA}`,
      { code },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return true;
  } catch (error) {
    console.error("2FA disable failed", error);
    throw error;
  }
}; 

export const logout = async (authToken: string) => {
  try {
    // Try to notify the server about logout (token revocation)
    try {
      await springAxios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
        null,
        { 
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          withCredentials: true 
        }
      );
    } catch (error) {
      // Log but continue with client-side logout even if server call fails
      console.warn('Server logout failed, continuing with client-side logout:', error);
    }
    
    // Clear ALL authentication-related data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken'); // In case both naming conventions are used
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('oauthProvider');
    
    // Clear any session cookies that might be related to OAuth
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    return true;
  } catch (error) {
    console.error('Logout process failed:', error);
    
    // Even if the overall process fails, still try to clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    if (axios.isAxiosError(error)) {
      // Your existing error handling
    }
    
    // Return false but the user should still be logged out client-side
    return false;
  }
};

export const loginWithGoogle = async () => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}/oauth2/google`);
    return response.data;
  } catch (error) {
    console.error("Google login failed", error);
    throw error;
  }
};

export const loginWithGithub = async () => {
  try {
    const response = await springAxios.get(`${API_CONFIG.BASE_URL}/oauth2/github`);
    return response.data;
  } catch (error) {
    console.error("GitHub login failed", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await springAxios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.CURRENT_USER}`);
  return { data: response.data };
};


export const verifyEmail = async (token: string) => {
  try {
    console.log('Calling verify endpoint with token:', token);
    
    // First approach - direct API call
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Verification failed');
    }

    return await response.json();
  } catch (fetchError) {
    console.error('Fetch verification failed, trying axios:', fetchError);
    
    // Fallback to axios if fetch fails
    try {
      const response = await springAxios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL}`,
        { token },
        { timeout: 15000 }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Verification failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  }
};

export const resendVerificationEmail = async () => {
  try {
    const response = await springAxios.post(
      `${API_CONFIG.BASE_URL}/api/v1/auth/resend-verification`
    );
    return response.data;
  } catch (error: any) {
    console.error("Resend verification error:", error.response?.data || error);
    throw error;
  }
};

