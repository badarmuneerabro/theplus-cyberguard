import React from 'react';
import Link from 'next/link';

const VerificationSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
          Email Verified Successfully!
        </h1>
        <p className="text-center mb-6">
          Your email has been verified. You can now log in to your account.
        </p>
        <div className="text-center">
          <Link href="/auth/login">
            <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Go to Login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;