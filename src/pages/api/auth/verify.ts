import { springAxios } from '../../../config/axiosConfig';

export default async function handler(req: { method: string; query: { token: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; redirect: (arg0: string) => void; }) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;
  
  if (!token) {
    console.error("Token missing in request");
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Forward the request to the backend
    const response = await springAxios.post(
      '/api/v1/auth/verify-email',  // This path should match your backend API exactly
      { token },  // Don't encode the token unless your backend specifically requires it
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000  // Increased timeout for reliability
      }
    );

    // Log the response for debugging
    console.log('Verification response:', response.data);

    if (response.status !== 200) {
      console.error('Backend verification failed:', response.data);
      throw new Error(response.data.message || 'Verification failed');
    }
    
    res.redirect('/auth/verification-success');
  } catch (error) {
    console.error('Verification failed:', error);
    res.redirect('/auth/verification-failed');
  }
}