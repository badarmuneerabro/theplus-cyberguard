import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image'; // Import Image from next/image
import { setup2FA } from '../../services/authService';

// Define prop types
interface Enable2FAProps {
  email: string;
}

export default function Enable2FA({ email }: Enable2FAProps) {
  const [qrCode, setQRCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); // Set loading to true when the effect runs
    setError(null); // Reset error state if any
    // Import the setup2FA function from the auth service

    const fetchQRCode = async () => {
      try {
        // You'll need to retrieve the auth token from your application's state or storage
        const authToken = localStorage.getItem('authToken') || '';
        
        const response = await setup2FA(authToken);
        setQRCode(response.qrCodeUrl);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch QR code. Please try again.');
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [email]);

  if (loading) {
    return <p>Loading QR code...</p>; // You can customize this loading state
  }

  if (error) {
    return <p>{error}</p>; // Show error message if there's any issue
  }

  return (
    <div>
      <h3>Scan the QR code with your authenticator app</h3>
      <Image
        src={qrCode} 
        alt="QR code for Google Authenticator"
        width={300} // Provide specific width
        height={300} // Provide specific height
      />
    </div>
  );
}
