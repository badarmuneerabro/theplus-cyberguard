export default async function handler(req: { method: string; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; end: { (arg0: string): void; new(): any; }; }; setHeader: (arg0: string, arg1: string[]) => void; }) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      // Get the response data
      const text = await response.text();
      
      // Try to parse as JSON, but handle text responses too
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
      
      // Forward the response status and data
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error forwarding registration:', error);
      return res.status(500).json({ message: 'Error forwarding registration request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}