/* import { Button, TextField, Typography, Container } from '@mui/material';

export default function ResetPassword() {
  return (
    <Container maxWidth="sm" sx={{ marginTop: '4rem' }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your email address and we’ll send you a link to reset your password.
      </Typography>

      <TextField fullWidth label="Email" margin="normal" type="email" required />

      <Button fullWidth variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
        Send Reset Link
      </Button>
    </Container>
  );
}
 */


import { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import springAxios from 'axios';
import { useRouter } from 'next/router';

const apiGatewayUrl = '';  // API Gateway URL


const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      const response = await springAxios.post('http://localhost:8080/auth/v1/reset-password', {
        email,
      });

      if (response.status === 200) {
        setMessage('Reset link sent! Redirecting to sign-in page...');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setMessage('Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '4rem' }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your email address and we’ll send you a link to reset your password.
      </Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ marginTop: '1rem' }}
        onClick={handleResetPassword}
      >
        Send Reset Link
      </Button>

      {message && (
        <Typography color="primary" sx={{ marginTop: '1rem' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ResetPassword;
