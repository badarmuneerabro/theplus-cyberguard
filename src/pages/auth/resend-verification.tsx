import React, { useState } from 'react';
import { verifyEmail, resendVerificationEmail } from '../../services/authService';

export default function ResendVerification() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await resendVerificationEmail();  // Call API to resend
      setMessage(response.message || 'Verification email sent!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to resend email');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Resend Verification Email</h1>

      {message && <p className="mb-4 text-gray-600">{message}</p>}

      <button
        onClick={handleResend}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>
    </div>
  );
}
