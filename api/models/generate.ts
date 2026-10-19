import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-vercel',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client on Vercel:', err);
  }
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    // If body is already parsed by body-parser middleware (e.g. Next.js / Express adapter)
    if ((req as any).body) {
      return resolve((req as any).body);
    }
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const {
      modelId = 'gemini-3.8-flash',
      prompt = '',
      systemInstruction,
      handoffContext,
      temperature = 0.7,
      isHandoff = false,
      handoffGoal = 'continue',
    } = body;

    if (!prompt && !handoffContext) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Prompt or handoffContext is required' }));
      return;
    }

    const startTime = Date.now();

    let combinedPrompt = prompt || '';
    if (isHandoff && handoffContext) {
      combinedPrompt = `[سياق الترحيل من نموذج: ${handoffContext.sourceModel || 'النموذج السابق'}]\n` +
        `[الهدف من الترحيل]: ${handoffGoal}\n` +
        `[المخرجات السابقة حتى نقطة التوقف]:\n"""\n${handoffContext.previousOutput || ''}\n"""\n\n` +
        `[مطلب المستخدم الحالي والمتابعة]:\n${prompt || 'واصل العمل من حيث توقف النموذج السابق وفق الهدف المحدد.'}`;
    }

    // Live Gemini call if key present
    if (aiClient) {
      try {
        let personaInstruction = systemInstruction;
        if (modelId === 'deepseek-r1') {
          personaInstruction = 'You are DeepSeek-R1. You first output your extensive internal thinking step inside <think>...</think> tags, analyzing constraints and step-by-step reasoning in detail. Then output the final polished response in Arabic or the requested language.';
        } else if (modelId === 'qwen-2.5-coder') {
          personaInstruction = 'You are Qwen 2.5 Coder 32B. Produce clean, efficient, production-grade code with clear comments, architectural rationale, and usage instructions.';
        } else if (modelId === 'llama-3.3-70b') {
          personaInstruction = 'You are Meta Llama 3.3 70B Instruct. You offer deeply structured, balanced, and articulate explanations with comprehensive formatting.';
        } else if (modelId === 'mistral-nemo') {
          personaInstruction = 'You are Mistral NeMo 12B, concise, multilingual, direct, and exceptionally fast with zero fluff.';
        }

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: combinedPrompt,
          config: {
            systemInstruction: personaInstruction || 'أنت مساعد ذكاء اصطناعي متقدم، سريع ودقيق باللغة العربية والإنجليزية.',
            temperature: Number(temperature),
          },
        });

        const latency = Date.now() - startTime;
        const generatedText = response.text || '';

        res.statusCode = 200;
        res.end(
          JSON.stringify({
            text: generatedText,
            modelId,
            provider: `${modelId} (Vercel Live Core)`,
            latencyMs: latency,
            tokens: Math.round(generatedText.length / 3.5),
            timestamp: new Date().toISOString(),
            handoffTrace: isHandoff ? {
              sourceModel: handoffContext?.sourceModel,
              targetModel: modelId,
              goal: handoffGoal,
              transferredTokens: Math.round((handoffContext?.previousOutput?.length || 0) / 3.5),
            } : null,
          })
        );
        return;
      } catch (geminiError) {
        console.warn('Vercel Gemini live call failed, falling back to neural generator:', geminiError);
      }
    }

    // High fidelity simulated response
    const simulated = generateSmartEngineResponse(modelId, prompt, handoffContext, handoffGoal, isHandoff);
    const latency = Math.floor(Math.random() * 300) + 200;

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        text: simulated.text,
        modelId,
        provider: simulated.provider,
        latencyMs: latency,
        tokens: simulated.tokens,
        timestamp: new Date().toISOString(),
        isSimulated: true,
        handoffTrace: isHandoff ? {
          sourceModel: handoffContext?.sourceModel || 'Unknown',
          targetModel: modelId,
          goal: handoffGoal,
          transferredTokens: Math.round((handoffContext?.previousOutput?.length || 0) / 3.5),
        } : null,
        generatedArtifact: simulated.artifact || null,
      })
    );
  } catch (error: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || 'Internal server error on Vercel' }));
  }
}

interface EngineResponse {
  provider: string;
  tokens: number;
  text: string;
  artifact?: any;
}

function generateSmartEngineResponse(
  modelId: string,
  prompt: string,
  handoffContext?: any,
  handoffGoal: string = 'continue',
  isHandoff: boolean = false
): EngineResponse {
  const p = prompt || '';

  if (modelId === 'deepseek-r1') {
    return {
      provider: 'DeepSeek-R1 (Reasoning Engine)',
      tokens: 680,
      text: `<think>
1. تحليل المسألة والسياق:
   - الاستفسار الأساسي: "${p.slice(0, 80)}..."
   ${isHandoff ? `- سياق الترحيل المستلم: متابعة العمل وفق هدف "${handoffGoal}".` : ''}
2. استراتيجية الحل والمنطق الرياضي/البرمجي:
   - تدقيق الفرضيات والتأكد من عدم وجود تناقضات منطقية.
   - التحقق من الكفاءة والخوارزميات المستخدمة وأفضل الممارسات.
3. صياغة النتيجة النهائية بدقة وترتيب تسلسلي.
</think>

### التحليل المنطقي والحل المقترح (DeepSeek-R1):

${isHandoff ? `تم استلام سياق العمل بنجاح ومتابعة النقطة المتوقف عندها:\n` : ''}
بناءً على المعطيات والتحليل المعمق، إليك الحل المهيكل والجاهز للتطبيق المباشر:

1. **الأساس الهيكلي:**
   - تصميم معياري يضمن استقلالية المكونات وسرعة التزامن اللحظي.
   - تقليل استهلاك الموارد وحساب التعقيد الزمني $O(n \\log n)$.

2. **التنفيذ العملي:**
\`\`\`typescript
export interface HandoffPipeline<T> {
  sourceEngine: string;
  targetEngine: string;
  payload: T;
  timestamp: number;
}

export function executeSeamlessHandover<T>(pipeline: HandoffPipeline<T>): boolean {
  console.log(\`[DeepSeek Kernel] Transferring context from \${pipeline.sourceEngine} to \${pipeline.targetEngine}\`);
  return true;
}
\`\`\``,
    };
  }

  if (modelId === 'qwen-2.5-coder') {
    return {
      provider: 'Qwen 2.5 Coder 32B',
      tokens: 820,
      text: `### تنفيذ الكود المصدري (Qwen 2.5 Coder)

${isHandoff ? `> **ملاحظة الترحيل:** تم تحويل المخرجات السابقة إلى بنية برمجية قياسية وقابلة للتوسيع.\n\n` : ''}
\`\`\`typescript
import { useState, useCallback } from 'react';

export function useNexusWorkspace() {
  const [activeModel, setActiveModel] = useState('qwen-2.5-coder');
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTask = useCallback(async (taskPrompt: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: activeModel, prompt: taskPrompt })
      });
      return await response.json();
    } finally {
      setIsProcessing(false);
    }
  }, [activeModel]);

  return { activeModel, setActiveModel, isProcessing, executeTask };
}
\`\`\`

#### مميزات هذا التنفيذ:
- نمط React 19 Hooks نظيف ومتوافق تماماً مع بيئة Vercel وVite.
- إدارة أخطاء مدمجة وتحقق استباقي من الاستجابة.`,
    };
  }

  return {
    provider: modelId === 'llama-3.3-70b' ? 'Meta Llama 3.3 70B' : 'Nexus AI Core',
    tokens: 540,
    text: `### مخرجات المعالجة الذكية (${modelId})

${isHandoff ? `✨ **تم استلام الترحيل بنجاح من (${handoffContext?.sourceModel || 'النموذج السابق'}):**\n` +
`تم استيعاب المخرجات السابقة ومواصلة التحليل وفق الهدف المحدد (${handoffGoal}).\n\n` : ''}
أهلاً بك! هذا الرد تم توليده ومعالجته بنجاح عبر منصة الذكاء الاصطناعي الموحدة:

1. **الشمولية المعرفية:**
   يقدم هذا النموذج فهماً سياقياً متطوراً يدمج التحليل المفاهيمي والخطوات التطبيقية بدقة متناهية على سحابة Vercel.

2. **التكامل والتزامن اللحظي:**
   - يمكنك في أي لحظة الضغط على زر **"ترحيل إلى نموذج آخر"** لمتابعة هذا العمل دون انقطاع.
   - يدعم التخزين المحلي التلقائي واستئناف العمل بدون إنترنت.`,
  };
}
