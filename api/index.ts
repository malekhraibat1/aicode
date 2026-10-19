import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.end(
    JSON.stringify({
      message: 'NexusAI Vercel Serverless Gateway Active',
      status: 'online',
      endpoints: ['/api/health', '/api/models/generate'],
      timestamp: new Date().toISOString(),
    })
  );
}
