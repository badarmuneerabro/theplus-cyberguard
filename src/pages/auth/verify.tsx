import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyEmail } from '../../services/authService'; // Adjust this path if needed

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const tokenStr = Array.isArray(token) ? token[0] : token;
        await verifyEmail(tokenStr);
        setStatus('success');
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => router.push('/auth/login'), 2000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Email Verification</h1>
        
        {status === 'loading' && (
          <div className="text-center">
            <p>Verifying your email...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <p>{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <p>{message}</p>
            <button onClick={() => router.push('/auth/login')}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;