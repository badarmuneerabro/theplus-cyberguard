/* // src/components/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get('authToken');
      
      if (!token) {
        // Redirect to login if no token
        router.push('/auth/login');
      }
    }, []);

    // Check for token before rendering
    const token = Cookies.get('authToken');
    
    if (!token) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth; */