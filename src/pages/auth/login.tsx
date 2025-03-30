import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Divider, Box, 
  CircularProgress, Alert, Paper
} from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { API_CONFIG } from '@/config/apiConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);
  const router = useRouter();
  const { login } = useAuth();


  
  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Use the full URL for health check
        const response = await fetch(`${API_CONFIG.HEALTH_URL}`, {
          method: 'GET',
          signal: controller.signal
        }).catch(() => null);
        
        clearTimeout(timeoutId);
        setApiHealthy(!!response && response.ok);
      } catch (error) {
        setApiHealthy(false);
        console.error('API health check failed:', error);
      }
    };
    
    checkApiHealth();
  }, []);

  // Form validation
  const validateForm = () => {
    // Check if fields are filled
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (!password) {
      setErrorMessage('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Reset messages
    setErrorMessage('');
    setMessage('');
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    // If API is not healthy, show warning but let them try anyway
    if (!apiHealthy) {
      console.warn('API appears to be unreachable. Attempting login anyway...');
    }
    
    setLoading(true);
  
    try {
      // Manual debug log of what we're sending
      console.log('Attempting login with data:', {
        email, password,
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`
      });
      
      // Try the direct fetch approach
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        mode: 'cors',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      const responseText = await response.text();
      console.log('Raw response body:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        setErrorMessage('Received invalid response from server');
        setLoading(false);
        return;
      }
      
      if (response.ok) {
        console.log("Login successful, storing tokens");
        setMessage('Login successful! Redirecting...');
        
        // Store tokens in localStorage as a fallback
        if (data.token) localStorage.setItem('authToken', data.token);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        
        // Use the auth context to set the user as logged in
        login(data.token, data.refreshToken);
        
        // Force navigation after a short delay
        console.log("Starting redirect timer");
        
        // Try both methods for redirection
        setTimeout(() => {
          console.log("Executing redirect now");
          try {
            router.push('/dashboard');
          } catch (routerError) {
            console.error("Router navigation failed:", routerError);
            // Fallback to window.location if router fails
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        // Show detailed error information
        console.error('Login failed with status:', response.status);
        
        if (data?.message) {
          setErrorMessage(data.message);
        } else if (data?.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage(`Login failed (Status ${response.status}). Please try again.`);
        }
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      if (axios.isAxiosError(error)) {

        // Handle axios errors as before
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        console.error("Error message:", error.message);
      } else {
        setErrorMessage('An unexpected error occurred during login');
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    const providerName = provider === 'google' ? 'google' : 'github';
    
    // Use the correct OAuth endpoint that Spring Security recognizes
    window.location.href = `${API_CONFIG.BASE_URL}/oauth2/authorization/${providerName}`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      {!apiHealthy && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Connection Issue Detected</Typography>
          <Typography variant="body2">
            Unable to connect to the authentication service. The login might not work.
            Please make sure the API gateway is running at {API_CONFIG.BASE_URL}.
          </Typography>
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        {message && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {message}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errorMessage.includes('email')}
            autoFocus
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errorMessage.includes('Password')}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Divider sx={{ my: 2 }}>Or</Divider>
          
          <Button
            variant="outlined"
            startIcon={<FcGoogle />}
            onClick={() => handleOAuthLogin('google')}
            fullWidth 
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Sign in with Google
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FaGithub />}
            onClick={() => handleOAuthLogin('github')}
            fullWidth
            disabled={loading}
          >
            Sign in with GitHub
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/auth/signup" passHref>
              <Typography variant="body2" component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Don't have an account? Sign Up
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;