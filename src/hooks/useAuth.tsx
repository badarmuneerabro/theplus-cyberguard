import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import * as authService from '../services/authService';
import * as userManagementService from '../services/userManagementService';
import { AxiosError } from 'axios';

interface AuthUser {
  name?: string;
  email?: string;
  image?: string;
}

interface Credential {
  email: string;
  password: string;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: Credential) => Promise<{ token: string; user: AuthUser }>;
  register: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create auth context with a default value
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkUserAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (err) {
          console.error('Failed to get current user:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkUserAuth();
  }, []);

  // Handle login
  const login = async (credentials: Credential): Promise<{ token: string; user: AuthUser }> => {
    try {
      setError(null);
      const response = await authService.login(credentials.email, credentials.password);
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Get the user data after successful login
      const userResponse = await authService.getCurrentUser();
      setUser(userResponse.data);
      
      router.push('/dashboard');
      return { token, user: userResponse.data };
    } catch (err) {
      const axiosError = err as AxiosError<{message: string}>;
      const errorMessage = axiosError.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  // Handle signup
  const register = async (userData: UserData): Promise<void> => {
    try {
      setError(null);
      await authService.register(
        userData.firstName || '',
        userData.lastName || '',
        userData.email,
        userData.password
      );
      router.push('/auth/login?registered=true');
    } catch (err) {
      const axiosError = err as AxiosError<{message: string}>;
      const errorMessage = axiosError.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      throw err;
    }
  };

  // Handle logout
  const logout = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token) {
      await authService.logout(token);
    }
    setUser(null);
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  // OAuth login handlers
  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  const loginWithGithub = () => {
    authService.loginWithGithub();
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Auth context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 