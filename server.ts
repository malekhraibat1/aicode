import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
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
  });
});

// Generation endpoint supporting real Gemini API + cross-model handoffs
app.post('/api/models/generate', async (req: Request, res: Response) => {
  try {
    const {
      modelId,
      prompt,
      systemInstruction,
      handoffContext,
      temperature = 0.7,
      isHandoff = false,
      handoffGoal = 'continue',
    } = req.body;

    if (!prompt && !handoffContext) {
      return res.status(400).json({ error: 'Prompt or handoffContext is required' });
    }

    const startTime = Date.now();

    // Prepare contextual prompt with handoff information if coming from another model
    let combinedPrompt = prompt || '';
    if (isHandoff && handoffContext) {
      combinedPrompt = `[سياق الترحيل من نموذج: ${handoffContext.sourceModel || 'النموذج السابق'}]\n` +
        `[الهدف من الترحيل]: ${handoffGoal}\n` +
        `[المخرجات السابقة حتى نقطة التوقف]:\n"""\n${handoffContext.previousOutput || ''}\n"""\n\n` +
        `[مطلب المستخدم الحالي والمتابعة]:\n${prompt || 'واصل العمل من حيث توقف النموذج السابق وفق الهدف المحدد.'}`;
    }

    // If Gemini model is requested and we have aiClient, call real Gemini API
    if ((modelId === 'gemini-3.8-flash' || !modelId) && aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: combinedPrompt,
          config: {
            systemInstruction: systemInstruction || 'أنت مساعد ذكاء اصطناعي متقدم، سريع ودقيق باللغة العربية والإنجليزية، تدعم التعاون وتدفق العمل بين النماذج.',
            temperature: Number(temperature),
          },
        });

        const latency = Date.now() - startTime;
        const generatedText = response.text || '';
        const estimatedTokens = Math.round(generatedText.length / 3.5);

        return res.json({
          text: generatedText,
          modelId: 'gemini-3.8-flash',
          provider: 'Google AI (Live Engine)',
          latencyMs: latency,
          tokens: estimatedTokens,
          timestamp: new Date().toISOString(),
          handoffTrace: isHandoff ? {
            sourceModel: handoffContext?.sourceModel,
            targetModel: 'gemini-3.8-flash',
            goal: handoffGoal,
            transferredTokens: Math.round((handoffContext?.previousOutput?.length || 0) / 3.5),
          } : null,
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to smart simulated engine:', geminiError?.message);
      }
    }

    // Or if Gemini key is available, we can also use Gemini as the backend brain parameterized with the persona of DeepSeek/Llama/Mistral/Qwen!
    if (aiClient && (modelId.startsWith('deepseek') || modelId.startsWith('llama') || modelId.startsWith('qwen') || modelId.startsWith('mistral') || modelId.startsWith('phi'))) {
      try {
        let personaInstruction = '';
        if (modelId === 'deepseek-r1') {
          personaInstruction = 'You are DeepSeek-R1. You first output your extensive internal thinking step inside <think>...</think> tags, analyzing constraints, logic, and step-by-step reasoning in detail. Then output the final polished response in Arabic or the requested language.';
        } else if (modelId === 'qwen-2.5-coder') {
          personaInstruction = 'You are Qwen 2.5 Coder 32B, the premier open-weights coding assistant. Produce clean, efficient, bug-free code with clear comments, architectural rationale, and usage instructions.';
        } else if (modelId === 'llama-3.3-70b') {
          personaInstruction = 'You are Meta Llama 3.3 70B Instruct. You offer deeply structured, balanced, and articulate explanations with comprehensive formatting.';
        } else if (modelId === 'mistral-nemo') {
          personaInstruction = 'You are Mistral NeMo 12B, concise, multilingual, direct, and exceptionally fast with zero fluff.';
        } else {
          personaInstruction = systemInstruction || 'You are an advanced AI engine.';
        }

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: combinedPrompt,
          config: {
            systemInstruction: personaInstruction,
            temperature: Number(temperature),
          },
        });

        const latency = Date.now() - startTime;
        const generatedText = response.text || '';
        return res.json({
          text: generatedText,
          modelId,
          provider: `${modelId} (Simulated via Neural Core)`,
          latencyMs: latency,
          tokens: Math.round(generatedText.length / 3.5),
          timestamp: new Date().toISOString(),
          handoffTrace: isHandoff ? {
            sourceModel: handoffContext?.sourceModel,
            targetModel: modelId,
            goal: handoffGoal,
            transferredTokens: Math.round((handoffContext?.previousOutput?.length || 0) / 3.5),
          } : null,
        });
      } catch (e) {
        // Fall back to built-in smart generator below
      }
    }

    // High fidelity simulated response for offline or zero-key mode
    const simulated = generateSmartEngineResponse(modelId, prompt, handoffContext, handoffGoal, isHandoff);
    const latency = Math.floor(Math.random() * 400) + 250;

    return res.json({
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
    });
  } catch (error: any) {
    console.error('Error in /api/models/generate:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Helper for realistic fallback outputs per model family
function generateSmartEngineResponse(
  modelId: string,
  prompt: string,
  handoffContext?: any,
  handoffGoal: string = 'continue',
  isHandoff: boolean = false
) {
  const p = prompt || '';
  const prev = handoffContext?.previousOutput || '';

  if (modelId === 'deepseek-r1') {
    return {
      provider: 'DeepSeek-R1 (Reasoning Engine)',
      tokens: 680,
      text: `<think>
1. تحليل المسألة والسياق:
   - الاستفسار الأساسي: "${p.slice(0, 80)}..."
   ${isHandoff ? `- سياق الترحيل المستلم: متابعة العمل وفق هدف "${handoffGoal}" من النموذج السابق.` : ''}
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
   - تقليل استهلاك الموارد وحساب التعقيد الزمني $O(n \\log n)$ لعمليات الفهرسة والبحث.

2. **التنفيذ العملي:**
\`\`\`typescript
// وحدة المعالجة والتزامن بين النماذج
interface HandoffPipeline<T> {
  sourceEngine: string;
  targetEngine: string;
  payload: T;
  stateChecksum: string;
  timestamp: number;
}

export function executeSeamlessHandover<T>(pipeline: HandoffPipeline<T>): boolean {
  console.log(\`[DeepSeek Kernel] Transferring context from \${pipeline.sourceEngine} to \${pipeline.targetEngine}\`);
  return true;
}
\`\`\`

3. **التوصية التقنية:**
   - الحفاظ على ذاكرة تخزين مؤقتة (Shared Vector Buffer) لتفادي إعادة حساب الرموز (Tokens) عند الترحيل المتكرر.`,
    };
  }

  if (modelId === 'qwen-2.5-coder') {
    return {
      provider: 'Qwen 2.5 Coder 32B',
      tokens: 820,
      text: `### تنفيذ الكود المصدري (Qwen 2.5 Coder)

${isHandoff ? `> **ملاحظة الترحيل:** تم تحويل المخرجات السابقة إلى بنية برمجية قياسية وقابلة للتوسيع.\n\n` : ''}
\`\`\`typescript
/**
 * نظام إدارة التدفق الموحد للنماذج المتعددة
 * تم توليده عبر Qwen 2.5 Coder 32B
 */
import { useState, useEffect, useCallback } from 'react';

export interface ModelSessionState {
  id: string;
  activeModel: string;
  promptHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  versionTree: Array<{ commitId: string; label: string; timestamp: number }>;
  isOffline: boolean;
}

export function useUnifiedAIHub() {
  const [session, setSession] = useState<ModelSessionState>({
    id: crypto.randomUUID(),
    activeModel: 'gemini-3.8-flash',
    promptHistory: [],
    versionTree: [],
    isOffline: !navigator.onLine,
  });

  const switchModelAndHandoff = useCallback(async (
    targetModel: string,
    goal: 'continue' | 'refine' | 'code' | 'summarize'
  ) => {
    // تزامن الحالة ونقل المؤشر للنموذج الهدف
    const lastOutput = session.promptHistory[session.promptHistory.length - 1]?.content || '';
    
    const response = await fetch('/api/models/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId: targetModel,
        prompt: \`تابع العمل وفق هدف: \${goal}\`,
        isHandoff: true,
        handoffGoal: goal,
        handoffContext: {
          sourceModel: session.activeModel,
          previousOutput: lastOutput
        }
      })
    });

    return await response.json();
  }, [session]);

  return { session, switchModelAndHandoff };
}
\`\`\`

#### مميزات هذا التنفيذ:
- نمط Hooks نظيف ومتوافق مع React 19.
- إدارة أخطاء مدمجة وتحقق استباقي من حالة الاتصال بالشبكة (Offline/Online Sync).`,
    };
  }

  if (modelId === 'flux-1-schnell') {
    return {
      provider: 'FLUX.1 Schnell (Vision Synthesis)',
      tokens: 310,
      text: `🎨 **تم إعداد وتوليد المفهوم البصري بواسطة FLUX.1 Schnell**

**الوصف التوليدي المعزز (Prompt Refinement):**
> *"Ultra-detailed futuristic holographic command center of a unified AI nexus, glowing cyan and violet data streams flowing between neural nodes, sleek dark glass UI panels floating in 3D space, ISO 100, 8k resolution, cinematic lighting, photorealistic octane render, masterpiece."*

**المعايير التقنية:**
- **الأبعاد:** 1024x1024 (مربع 1:1)
- **خطوات المعالجة (Inference Steps):** 4 خطوات فائقة السرعة
- **المطابقة البصرية:** متسقة 100% مع سياق الترحيل والمحتوى النصي.`,
      artifact: {
        type: 'image',
        title: 'تصور بصري للمشروع',
        aspectRatio: '1:1',
      }
    };
  }

  if (modelId === 'whisper-large-v3') {
    return {
      provider: 'Whisper Large v3 (Audio & Transcription)',
      tokens: 410,
      text: `🎙️ **تحليل وتفريغ الصوت التفاعلي (Whisper Large v3)**

- **معدل الدقة (WER):** 98.6%
- **اللغة المكتشفة:** العربية (لهجة معيارية حديثة / Modern Standard Arabic)
- **التوقيت الزمني (Timestamps):**
  - \`[00:00 - 00:04]\` مرحباً بكم في منصة الذكاء الاصطناعي الموحدة.
  - \`[00:04 - 00:09]\` سنقوم بترحيل مسار العمل مباشرة إلى نموذج التحليل التالي.
  - \`[00:09 - 00:15]\` تم حفظ نقطة التوقف الحالية وتصدير السجل بأمان.

**الملخص الدلالي:**
النص الصوتي يوضح آلية ترحيل البيانات اللحظية وإدارة الإصدارات دون فقدان أي سياق.`,
    };
  }

  // Default: Llama / Mistral / Gemini simulated
  return {
    provider: modelId === 'llama-3.3-70b' ? 'Meta Llama 3.3 70B' : 'Nexus AI Core',
    tokens: 540,
    text: `### مخرجات المعالجة الذكية (${modelId})

${isHandoff ? `✨ **تم استلام الترحيل بنجاح من (${handoffContext?.sourceModel || 'النموذج السابق'}):**\n` +
`تم استيعاب المخرجات السابقة ومواصلة التحليل وفق الهدف المحدد (${handoffGoal}).\n\n` : ''}
أهلاً بك! إليك الرد الشامل المنظم وفق أعلى معايير الجودة والأداء:

1. **الشمولية المعرفية:**
   يقدم هذا النموذج فهماً سياقياً متطوراً يدمج التحليل المفاهيمي والخطوات التطبيقية بدقة متناهية.

2. **التكامل والتزامن اللحظي:**
   - يمكنك في أي لحظة الضغط على زر **"ترحيل إلى نموذج آخر"** لمتابعة هذا العمل دون إعادة كتابة أي مدخلات.
   - يتم تخزين نسخة احتياطية مشفرة محلياً في قائمة الإصدارات، مع الحفاظ على التزامن في حال انقطاع الإنترنت.

3. **الخطوة التالية الموصى بها:**
   - للتطوير البرمجي: الترحيل إلى **Qwen 2.5 Coder**.
   - للتحليل المنطقي والرياضي: الترحيل إلى **DeepSeek-R1**.
   - لتصميم واجهات وصور المشروع: الترحيل إلى **FLUX.1 Schnell**.`,
  };
}

// Start Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
