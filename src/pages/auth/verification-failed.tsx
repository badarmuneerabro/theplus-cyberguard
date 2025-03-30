import React from 'react';
import Link from 'next/link';

const VerificationFailed = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 max-w-md w-full bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          Verification Failed
        </h1>
        <p className="text-center mb-6">
          We couldn't verify your email. The verification link may have expired or is invalid.
        </p>
        <div className="text-center">
          <Link href="/auth/login">
            <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4">
              Go to Login
            </a>
          </Link>
          <Link href="/auth/resend-verification">
            <a className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Resend Verification
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationFailed;