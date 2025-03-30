import { useState } from 'react';
import axios from 'axios';

// Define prop types
interface Verify2FAProps {
  email: string;
}

export default function Verify2FA({ email }: Verify2FAProps) {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    axios.post(`http://localhost:8081/auth/verify-2fa`, { email, code })
      .then(() => {
        alert('2FA verified successfully');
      })
      .catch(() => {
        alert('Invalid 2FA code');
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter 2FA code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
