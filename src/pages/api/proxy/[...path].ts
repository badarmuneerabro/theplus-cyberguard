import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  target: process.env.NEXT_PUBLIC_SPRING_API_URL || 'http://localhost:8080',
  changeOrigin: true,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Remove the '/api/proxy' prefix from the URL
  req.url = req.url?.replace('/api/proxy', '');
  
  // Handle potential body parsing issues
  if (req.body && typeof req.body === 'object') {
    req.body = JSON.stringify(req.body);
  }

  return new Promise<void>((resolve) => {
    // Add CORS headers to response
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  
    proxy.web(req, res, {
      proxyTimeout: 5000,
      selfHandleResponse: false,
    }, (err: any) => {
      console.error('Proxy error:', err);
      res.status(500).json({ message: 'Proxy error' });
      resolve();
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};