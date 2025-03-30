import Enable2FA from '@/components/2FA/Enable2FA';
import React from 'react';
import { springAxios } from '@/config/axiosConfig';

export default function Enable2FAPage() {
  const userEmail = "user@example.com";  // Replace this with the actual logged-in user's email

  return (
    <div>
      <h2>Enable 2FA</h2>
      <Enable2FA email={userEmail} />
    </div>
  );
}
