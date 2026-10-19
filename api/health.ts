import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      status: 'ok',
      platform: 'Vercel Serverless',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      modelsAvailable: [
        { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'Google AI', isLiveApi: Boolean(process.env.GEMINI_API_KEY) },
        { id: 'deepseek-r1', name: 'DeepSeek-R1 (Reasoning)', provider: 'DeepSeek AI', isFree: true },
        { id: 'llama-3.3-70b', name: 'Llama 3.3 70B Instruct', provider: 'Meta AI', isFree: true },
        { id: 'mistral-nemo', name: 'Mistral NeMo 12B', provider: 'Mistral AI', isFree: true },
        { id: 'qwen-2.5-coder', name: 'Qwen 2.5 Coder 32B', provider: 'Alibaba Cloud', isFree: true },
        { id: 'phi-4-mini', name: 'Microsoft Phi-4', provider: 'Microsoft Research', isFree: true },
        { id: 'flux-1-schnell', name: 'FLUX.1 Schnell (Vision)', provider: 'Black Forest Labs', isFree: true },
        { id: 'whisper-large-v3', name: 'Whisper Large v3 (Audio)', provider: 'OpenAI Open-Weights', isFree: true },
      ]
    })
  );
}
