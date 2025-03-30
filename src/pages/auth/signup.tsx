import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Divider, Box, 
  CircularProgress, Alert, Paper
} from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { register } from '@/services/authService';
import { API_CONFIG } from '@/config/apiConfig';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);
  
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
    if (!firstName.trim()) {
      setErrorMessage('First name is required');
      return false;
    }
    
    if (!lastName.trim()) {
      setErrorMessage('Last name is required');
      return false;
    }
    
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
    
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
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
    
    setLoading(true);
  
    try {
      // Create the user data object
      const userData = {
        firstName,
        lastName,
        email,
        password
      };
      
      console.log('Attempting to submit user data:', userData);
      console.log('Request URL:', `${API_CONFIG.BASE_URL}/api/v1/auth/register`);
      
      const response = await fetch('/api/v1/auth/register', { // Use relative path to your Next.js API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      
      // Get the raw response first
      const rawResponse = await response.text();
      console.log('Raw server response:', rawResponse);
      
      let data;
      try {
        // Only try to parse if it looks like JSON
        if (rawResponse && rawResponse.trim().startsWith('{')) {
          data = JSON.parse(rawResponse);
          console.log('Parsed response data:', data);
        }
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
      }
      
      if (response.ok) {
        setMessage('Sign up successful! Please check your email to verify your account.');
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      } else {
        // Show detailed error information
        console.error('Registration failed with status:', response.status);
        
        if (data?.message) {
          setErrorMessage(data.message);
        } else if (data?.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage(`Registration failed (Status ${response.status}). Please try again.`);
        }
      }
    } catch (error) {
      console.error('Registration error details:', error);
      setErrorMessage('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = (provider: string) => {
    // Use the API_CONFIG from your configuration
    const oauthEndpoint = provider === 'google' 
      ? '/api/v1/auth/oauth2/google' 
      : '/api/v1/auth/oauth2/github';
    
    // Construct the full OAuth authorization URL
    const authorizationUrl = `${API_CONFIG.BASE_URL}${oauthEndpoint}`;
    
    // Redirect to the authorization endpoint
    window.location.href = authorizationUrl;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      {!apiHealthy && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Connection Issue Detected</Typography>
          <Typography variant="body2">
            Unable to connect to the authentication service. The registration might not work.
            Please make sure the API gateway is running at {API_CONFIG.BASE_URL}.
          </Typography>
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign Up
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
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errorMessage.includes('first name')}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errorMessage.includes('last name')}
          />
          
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
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errorMessage.includes('Password')}
            helperText="Password must be at least 8 characters long"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Divider sx={{ my: 2 }}>Or</Divider>
          
          <Button
            variant="outlined"
            startIcon={<FcGoogle />}
            onClick={() => handleOAuthSignUp('google')}
            fullWidth 
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Sign up with Google
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FaGithub />}
            onClick={() => handleOAuthSignUp('github')}
            fullWidth
            disabled={loading}
          >
            Sign up with GitHub
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/auth/login" passHref>
              <Typography variant="body2" component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Already have an account? Sign In
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;