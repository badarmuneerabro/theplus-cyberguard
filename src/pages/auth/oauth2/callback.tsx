import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress } from '@mui/material';

export default function OAuth2Callback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const token = decodeURIComponent(router.query.token as string || '');
    const refreshToken = decodeURIComponent(router.query.refreshToken as string || '');

    if (token) {
      localStorage.setItem('authToken', token);

      // Store refresh token if available
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Get user info with the token
      fetch('http://localhost:8080/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              throw new Error(err.message || 'Failed to get user info');
            });
          }
          return response.json();
        })
        .then(user => {
          localStorage.setItem('user', JSON.stringify(user)); // Store user info
          router.push('/dashboard'); // Redirect to dashboard
        })
        .catch(err => {
          console.error('Error:', err.message);
          setError(err.message);
          setTimeout(() => router.push('/dashboard'), 3000); // Redirect after error
        });
    } else {
      setError('No token received');
      setTimeout(() => router.push('/auth/login?error=auth_failed'), 3000); // Redirect to login page
    }
  }, [router.isReady, router.query]);

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '50vh' }}
    >
      {error ? (
        <>
          <Typography variant="h6" color="error">{error}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Redirecting...</Typography>
        </>
      ) : (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>Authentication successful</Typography>
        </>
      )}
    </Container>
  );
}
