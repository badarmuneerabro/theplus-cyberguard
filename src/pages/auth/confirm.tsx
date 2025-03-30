import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

const apiGatewayUrl = '';  // API Gateway URL


export default function ConfirmEmail() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      axios.get(`/auth/confirm?token=${token}`)
        .then(response => {
          alert('Email confirmed successfully!');
          router.push('/auth/signin'); // Redirect to sign-in page
        })
        .catch(error => {
          alert('Email confirmation failed.');
        });
    }
  }, [token]);

  return <div>Confirming your email...</div>;
}
