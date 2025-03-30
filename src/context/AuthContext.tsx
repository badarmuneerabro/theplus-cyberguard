import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}

// In your AuthContext.tsx or similar file
const AuthContext = createContext({
  isAuthenticated: false,
  login: (token: string, refreshToken: string) => {},
  logout: () => {},
  // other auth methods
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = useCallback((token: string, refreshToken: string) => {
    console.log("AuthContext: Setting user as logged in");
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);