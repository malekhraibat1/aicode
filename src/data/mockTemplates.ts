import { WorkspaceMessage, VersionCommit, SharedAsset, CustomWorkflow } from '../types';

export const INITIAL_MESSAGES: WorkspaceMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'أريد تصميم نظام ذكي لإدارة ومتابعة تدفق العمل بين نماذج الذكاء الاصطناعي مع إمكانية الترحيل اللحظي وحفظ الإصدارات.',
    timestamp: Date.now() - 3600000 * 2,
    tokens: 42,
  },
  {
    id: 'msg-2',
    role: 'assistant',
    modelId: 'deepseek-r1',
    provider: 'DeepSeek AI (Reasoning Engine)',
    content: `<think>
1. فهم المعمارية المطلوبة:
   - المستخدم يحتاج إلى نظام مركزي (Hub) يجمع نماذج الذكاء الاصطناعي المجانية.
   - الميزة الجوهرية: "متابعة العمل من مكان التوقف للنموذج الآخر" (Seamless Cross-Model Hand-off).
   - هذا يتطلب بنية بيانات لحفظ سياق الترحيل (Handoff Trace)، ومؤشر الرموز المتبقية، وتوثيق سجل الإصدارات (VCS).
2. التخطيط للمراحل:
   - هيكلة الواجهة الموحدة والمزامنة اللحظية.
   - خط الترحيل بين DeepSeek للتفكير، Qwen للبرمجة، وFLUX للمفاهيم البصرية.
</think>

### التحليل المعماري للنظام الموحد (بواسطة DeepSeek-R1):

تمت دراسة متطلبات النظام، وإليك الركائز الأساسية المعتمدة لتحقيق الترحيل اللحظي:

1. **جسر ترحيل السياق (Context Handoff Bridge):**
   - حفظ آخر حالة للمخرجات (Payload State).
   - توجيه الهدف المخصص: مثل "مواصلة التوليد"، أو "تحويل لكود"، أو "توليد صورة".
   
2. **سجل الإصدارات المركزي (VCS Log):**
   - تسجيل كل عملية تعديل أو ترحيل كنقطة استرجاع (Commit) تحتوي على الفروقات اللحظية.

3. **التزامن دون اتصال (Offline-first):**
   - استخدام مخزن محلي متزامن تلقائياً فور عودة اتصال الشبكة.`,
    timestamp: Date.now() - 3600000 * 2 + 15000,
    latencyMs: 820,
    tokens: 580,
  },
  {
    id: 'msg-3',
    role: 'assistant',
    modelId: 'qwen-2.5-coder',
    provider: 'Qwen 2.5 Coder 32B',
    handoffTrace: {
      sourceModel: 'DeepSeek-R1',
      targetModel: 'Qwen 2.5 Coder 32B',
      goal: 'code',
      goalLabelAr: 'تحويل إلى كود برمجي تنفيذي',
      goalLabelEn: 'Transform to Executable Code',
      timestamp: Date.now() - 3600000 * 1.5,
      transferredTokens: 580,
      snippetPreview: 'تم ترحيل مخرجات التحليل المعماري من DeepSeek-R1 لمتابعة البرمجة...',
    },
    content: `### تطبيق الكود المصدري لمنظومة الترحيل (بواسطة Qwen 2.5 Coder)

> 🔄 **عملية ترحيل ناجحة:** تم استلام التحليل المعماري من **DeepSeek-R1**، وتحويله مباشرة إلى واجهة برمجية متكاملة وقابلة لإعادة الاستخدام:

\`\`\`typescript
export interface CrossModelHandoffPayload {
  sessionId: string;
  sourceEngine: 'deepseek-r1' | 'gemini-3.8-flash' | 'qwen-2.5-coder' | 'flux-1-schnell';
  targetEngine: string;
  contextBuffer: string;
  objective: 'continue' | 'refine' | 'code' | 'visualize';
  tokenCheckpoint: number;
}

export async function dispatchHandoff(payload: CrossModelHandoffPayload) {
  const response = await fetch('/api/models/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modelId: payload.targetEngine,
      isHandoff: true,
      handoffGoal: payload.objective,
      handoffContext: {
        sourceModel: payload.sourceEngine,
        previousOutput: payload.contextBuffer,
      }
    })
  });
  return await response.json();
}
\`\`\`

✅ **الميزات المدمجة في هذا الكود:**
- معالجة الأخطاء والتوافق مع بيئة العمل دون اتصال (Offline Queue).
- حساب تلقائي لفروقات الرموز وربطها بنظام الإصدارات المركزي.`,
    timestamp: Date.now() - 3600000 * 1.5,
    latencyMs: 740,
    tokens: 640,
  }
];

export const INITIAL_COMMITS: VersionCommit[] = [
  {
    id: 'vcs-c1a4',
    tag: 'v1.0-الأساس',
    message: 'المسودة الأولى: استشارة DeepSeek-R1 في المعمارية المركزية',
    author: 'المستخدم الرئيسي (narhar.MH)',
    timestamp: Date.now() - 3600000 * 2,
    modelId: 'deepseek-r1',
    promptCount: 2,
    snapshotMessages: [INITIAL_MESSAGES[0], INITIAL_MESSAGES[1]],
    diffSummary: { additions: 38, deletions: 0 },
  },
  {
    id: 'vcs-e8b2',
    tag: 'v1.1-البرمجة',
    message: 'ترحيل سياق العمل إلى Qwen 2.5 Coder وتوليد الكود التنفيذي',
    author: 'الترحيل التلقائي (Handoff Pipeline)',
    timestamp: Date.now() - 3600000 * 1.5,
    modelId: 'qwen-2.5-coder',
    promptCount: 3,
    snapshotMessages: [...INITIAL_MESSAGES],
    diffSummary: { additions: 52, deletions: 4 },
  },
];

export const INITIAL_ASSETS: SharedAsset[] = [
  {
    id: 'ast-1',
    title: 'برومبت الترحيل الذكي الشامل',
    category: 'prompt',
    description: 'قالب برومبت احترافي يضمن نقل وتلخيص سياق النماذج بدون فقدان البيانات الجوهرية.',
    content: 'خذ المخرجات السابقة، واستخرج منها النقاط غير المكتملة، وواصل العمل انطلاقاً من السطر الأخير بدقة برمجية عالية.',
    tags: ['Handoff', 'System Prompt', 'Workflow'],
    dateAdded: '2026-10-18',
    sizeKb: 1.4,
    author: 'فريق هندسة الأوامر',
  },
  {
    id: 'ast-2',
    title: 'مكتبة دوال التزامن اللحظي (Sync Engine)',
    category: 'code',
    description: 'كود جاهز للتعامل مع المزامنة بين التخزين المحلي والخادم السحابي وإدارة التعارضات.',
    content: 'export function syncLocalQueue() { /* Handles background delta sync */ }',
    tags: ['TypeScript', 'Offline', 'Sync'],
    dateAdded: '2026-10-17',
    sizeKb: 3.2,
    author: 'Qwen Coder Core',
  },
  {
    id: 'ast-3',
    title: 'دليل تصدير المشاريع المتوافقة (Universal Spec)',
    category: 'doc',
    description: 'مواصفة قياسية لتبادل محادثات ونماذج الذكاء الاصطناعي بين صيغ HuggingFace وOpenAI وNotebook.',
    content: '# Universal AI Interchange Format (UAIF)\nVersion: 2.4\nSupports multi-turn dialogs and model branching.',
    tags: ['Documentation', 'Standards', 'Export'],
    dateAdded: '2026-10-16',
    sizeKb: 8.5,
    author: 'Nexus Standards Committee',
  },
  {
    id: 'ast-4',
    title: 'هندسة أوامر الرؤية وتوليد الصور (FLUX Schnell)',
    category: 'prompt',
    description: 'مجموعة معدلات برومبت جاهزة للأسلوب السينمائي والهندسي ثلاثي الأبعاد.',
    content: 'hyper-detailed, isometric 3D render, octane engine, clean lighting, 8k resolution, minimalist studio background.',
    tags: ['FLUX', 'Vision', 'Prompt Engineering'],
    dateAdded: '2026-10-15',
    sizeKb: 2.1,
    author: 'Studio Design Lab',
  },
];

export const INITIAL_WORKFLOWS: CustomWorkflow[] = [
  {
    id: 'wf-1',
    name: 'سلسلة التفكير ثم الكود ثم النقد (Reason ➔ Code ➔ Review)',
    description: 'تدفق آلي متسلسل يبدأ بالتحليل المنطقي في DeepSeek، ثم كتابة الكود في Qwen، ثم التدقيق في Gemini 3.8.',
    isActive: true,
    webhookEnabled: true,
    lastRun: 'منذ ساعتين',
    steps: [
      {
        id: 'step-1',
        title: 'التحليل المعماري والمنطقي',
        modelId: 'deepseek-r1',
        actionGoal: 'continue',
        promptTemplate: 'قم بتحليل متطلبات الفكرة ووضع المخطط الهيكلي وخوارزمية الحل.',
        status: 'completed',
        outputResult: 'تم إعداد التحليل المعماري وتحديد المكونات الرئيسية بنجاح.',
      },
      {
        id: 'step-2',
        title: 'كتابة الكود البرمجي واختبارات الوحدة',
        modelId: 'qwen-2.5-coder',
        actionGoal: 'code',
        promptTemplate: 'حول المخطط السابق إلى كود TypeScript متكامل وقابل للاختبار.',
        status: 'completed',
        outputResult: 'تم توليد واجهات البرمجة والمكونات البرمجية واختبارات Jest.',
      },
      {
        id: 'step-3',
        title: 'مراجعة الأداء والتدقيق الأمني',
        modelId: 'gemini-3.8-flash',
        actionGoal: 'refine',
        promptTemplate: 'دقق الكود بحثاً عن أي ثغرات أمنية واقترح تحسينات السرعة والذاكرة.',
        status: 'idle',
      },
    ],
  },
  {
    id: 'wf-2',
    name: 'توليد المحتوى الإبداعي والتصور البصري (Content ➔ Visual)',
    description: 'صياغة فكرة المحتوى والمقترح التسويقي ثم توليد البرومبت البصري والصورة عبر FLUX.',
    isActive: true,
    webhookEnabled: false,
    lastRun: 'منذ يوم',
    steps: [
      {
        id: 'step-1',
        title: 'صياغة المفهوم الإبداعي',
        modelId: 'llama-3.3-70b',
        actionGoal: 'continue',
        promptTemplate: 'ابتكر مفهوماً تسويقياً فريداً للمنتج مع نبرة حديثة.',
        status: 'completed',
      },
      {
        id: 'step-2',
        title: 'توليد الصورة الفنية الترويجية',
        modelId: 'flux-1-schnell',
        actionGoal: 'visualize',
        promptTemplate: 'حول المفهوم التسويقي إلى مشهد بصري سينمائي ثلاثي الأبعاد.',
        status: 'completed',
      },
    ],
  },
];
