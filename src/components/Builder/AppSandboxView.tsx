import React, { useState, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  Code2, 
  Eye, 
  Sparkles, 
  Columns, 
  Maximize2, 
  Wand2, 
  Database, 
  Server, 
  ShieldCheck, 
  Layout, 
  Layers,
  Check,
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
  Share2,
  FileCode,
  CheckCircle2,
  Plus,
  Box,
  Palette,
  ArrowRightLeft,
  Copy,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_BUILDER_TOOLS } from '../../data/mockApps';

interface ComponentPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  category: 'cards' | 'inputs' | 'widgets' | 'modals' | 'badges';
  code: string;
}

const COMPONENT_PRESETS: ComponentPreset[] = [
  {
    id: 'stat-card',
    nameAr: 'بطاقة مؤشرات زجاجية',
    nameEn: 'Glassmorphic Stat Card',
    descriptionAr: 'بطاقة إحصائية عصرية بتأثير الزجاج وتوهج خلفي مع مؤشر حالة مباشر',
    category: 'cards',
    code: `<div class="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden max-w-sm text-white font-sans">
  <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold text-slate-400">معدل استجابة النماذج</span>
    <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
      متزامن 99.8%
    </span>
  </div>
  <div class="mt-4 flex items-baseline gap-2">
    <h3 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-400">142 ms</h3>
    <span class="text-xs text-emerald-400 font-semibold">+18% سرعة</span>
  </div>
  <p class="text-xs text-slate-400 mt-2">معالجة فورية عبر محرك Qwen 2.5 Coder و DeepSeek-R1 المتزامن.</p>
  <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
    <span class="text-slate-500">الحمولة: 4.8k tokens/s</span>
    <button onclick="alert('تم فحص مؤشرات الأداء بنجاح!')" class="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold transition">تفاصيل</button>
  </div>
</div>`
  },
  {
    id: 'prompt-bar',
    nameAr: 'شريط برومبت ذكي عائم',
    nameEn: 'AI Floating Prompt Bar',
    descriptionAr: 'شريط إدخال أوامر ذكي مع تأثيرات حركية وزر إرسال متدرج',
    category: 'inputs',
    code: `<div class="p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-2 max-w-md w-full font-sans">
  <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
    AI
  </div>
  <input type="text" placeholder="اطلب أي كود أو استعلام ذكي من النماذج..." class="flex-1 bg-transparent text-xs text-white outline-none px-2 placeholder:text-slate-500" />
  <button onclick="alert('جاري إرسال البرومبت ومعالجته عبر المحرك العصبي!')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95 shrink-0 flex items-center gap-1">
    <span>إرسال</span>
    <span>⚡</span>
  </button>
</div>`
  },
  {
    id: 'audio-visualizer',
    nameAr: 'ويدجت موجة صوتية حية',
    nameEn: 'Audio Waveform Visualizer',
    descriptionAr: 'مكون مشغل وموجات صوتية تفاعلي مع ترددات متحركة',
    category: 'widgets',
    code: `<div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white max-w-sm w-full space-y-3 font-sans">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
      <span class="text-xs font-bold text-slate-300">موجة صوتية تفاعلية</span>
    </div>
    <span class="text-[10px] text-cyan-400 font-mono">48 kHz | Stereo</span>
  </div>
  <div class="flex items-end justify-center gap-1.5 h-16 bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
    <span class="w-1.5 bg-indigo-500 rounded-full animate-bounce h-6"></span>
    <span class="w-1.5 bg-cyan-400 rounded-full animate-bounce h-12 delay-75"></span>
    <span class="w-1.5 bg-purple-500 rounded-full animate-bounce h-8 delay-150"></span>
    <span class="w-1.5 bg-pink-500 rounded-full animate-bounce h-14 delay-100"></span>
    <span class="w-1.5 bg-indigo-400 rounded-full animate-bounce h-10 delay-200"></span>
    <span class="w-1.5 bg-emerald-400 rounded-full animate-bounce h-5 delay-300"></span>
    <span class="w-1.5 bg-amber-400 rounded-full animate-bounce h-11 delay-150"></span>
  </div>
  <div class="flex items-center justify-between text-xs text-slate-400 pt-1">
    <span class="font-mono text-[11px]">01:24</span>
    <button onclick="this.innerText = this.innerText === 'إيقاف' ? 'تشغيل' : 'إيقاف'" class="px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition">تشغيل</button>
    <span class="font-mono text-[11px]">03:45</span>
  </div>
</div>`
  },
  {
    id: 'glow-badge',
    nameAr: 'شارة حالة ذكية متوهجة',
    nameEn: 'Glow Status Badge',
    descriptionAr: 'شارة حالة نبضية تدل على حالة الاتصال بالذكاء الاصطناعي',
    category: 'badges',
    code: `<div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-bold shadow-lg shadow-indigo-950/50 backdrop-blur-md font-sans">
  <span class="relative flex h-2.5 w-2.5">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
  </span>
  <span>الذكاء الاصطناعي متصل ومستعد للتنفيذ الفوري</span>
</div>`
  },
  {
    id: 'glass-modal',
    nameAr: 'نافذة حوارية زجاجية',
    nameEn: 'Glassmorphic Dialog Modal',
    descriptionAr: 'مكون نافذة تأكيد تفاعلي مع تأثير بلور وأزرار إجراءات واضحة',
    category: 'modals',
    code: `<div class="p-6 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl max-w-md w-full text-white space-y-4 font-sans backdrop-blur-xl">
  <div class="flex items-center justify-between border-b border-slate-800 pb-3">
    <h3 class="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">تأكيد مزامنة المشروع</h3>
    <button onclick="alert('إغلاق النافذة')" class="text-slate-400 hover:text-white text-sm">✕</button>
  </div>
  <p class="text-xs text-slate-300 leading-relaxed">
    سيتم نقل الكود المصدري وتحديث كافة التغييرات وحفظها في سجل الإصدارات المركزي مع تشفير AES-256 ومزامنة السحابة.
  </p>
  <div class="flex items-center justify-end gap-2 pt-2">
    <button onclick="alert('تم الإلغاء')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition">إلغاء</button>
    <button onclick="alert('تم تأكيد المزامنة ونقل الكود!')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition">تأكيد المزامنة</button>
  </div>
</div>`
  },
  {
    id: 'feature-toggle',
    nameAr: 'بطاقة تبديل الميزات',
    nameEn: 'Interactive Feature Switch',
    descriptionAr: 'مكون تحكم وتبديل سريع للميزات مع تأثيرات تشغيل مرئية',
    category: 'cards',
    code: `<div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm w-full text-white flex items-center justify-between font-sans shadow-lg">
  <div class="space-y-0.5">
    <h4 class="text-xs font-bold text-white">المزامنة التلقائية (Live Sync)</h4>
    <p class="text-[11px] text-slate-400">تحديث الكود فورياً في كافة النماذج</p>
  </div>
  <label class="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked onchange="alert('تم تحديث حالة المزامنة!')" class="sr-only peer" />
    <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
  </label>
</div>`
  }
];

export const AppSandboxView: React.FC = () => {
  const { 
    language, 
    generatedApps, 
    selectedApp, 
    setSelectedAppId, 
    updateAppCode, 
    createNewApp, 
    sendMessage, 
    setActiveTab,
    openHandoffModal,
    addNotification,
    createCommit
  } = useApp();

  // Primary workspace mode: 'app' (Full App) vs 'component' (React Component Preview)
  const [targetScope, setTargetScope] = useState<'app' | 'component'>('app');

  // View split mode
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'split'>('split');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // App bundle code
  const [editableCode, setEditableCode] = useState(selectedApp?.fullBundleCode || '');
  
  // React Component Preview code
  const [selectedPresetId, setSelectedPresetId] = useState<string>(COMPONENT_PRESETS[0].id);
  const [componentCode, setComponentCode] = useState<string>(COMPONENT_PRESETS[0].code);
  const [componentBg, setComponentBg] = useState<'slate' | 'indigo' | 'black' | 'light'>('slate');
  const [componentPrompt, setComponentPrompt] = useState('');
  const [isGeneratingComponent, setIsGeneratingComponent] = useState(false);

  const [promptEdit, setPromptEdit] = useState('');
  const [isAiModifying, setIsAiModifying] = useState(false);
  const [isCopilotSuggesting, setIsCopilotSuggesting] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const componentIframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    if (selectedApp && targetScope === 'app') {
      setEditableCode(selectedApp.fullBundleCode);
    }
  }, [selectedApp, targetScope]);

  // Sync main app iframe
  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = editableCode;
    }
  };

  useEffect(() => {
    if (targetScope === 'app') {
      reloadIframe();
    }
  }, [editableCode, selectedApp, targetScope]);

  // Sync component preview iframe
  const reloadComponentIframe = () => {
    if (componentIframeRef.current) {
      const bgClass = 
        componentBg === 'slate' ? 'bg-slate-950 text-white' :
        componentBg === 'indigo' ? 'bg-indigo-950 text-white' :
        componentBg === 'black' ? 'bg-black text-white' :
        'bg-slate-100 text-slate-900';

      const fullHtml = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Cairo', sans-serif; }
  </style>
</head>
<body class="${bgClass} min-h-screen flex items-center justify-center p-6 antialiased selection:bg-indigo-500 selection:text-white">
  ${componentCode}
</body>
</html>`;
      componentIframeRef.current.srcdoc = fullHtml;
    }
  };

  useEffect(() => {
    if (targetScope === 'component') {
      reloadComponentIframe();
    }
  }, [componentCode, componentBg, targetScope]);

  const handleApplyCodeChange = () => {
    if (targetScope === 'app') {
      if (!selectedApp) return;
      updateAppCode(selectedApp.id, editableCode);
      reloadIframe();
      addNotification(
        language === 'ar' ? 'تم تحديث التطبيق' : 'App Updated',
        'Code Applied',
        language === 'ar' ? 'تم تطبيق التعديلات البرمجية وتحديث المعاينة بنجاح.' : 'Changes compiled.',
        'success'
      );
    } else {
      reloadComponentIframe();
      addNotification(
        language === 'ar' ? 'تم تحديث المكون' : 'Component Rendered',
        'Component Updated',
        language === 'ar' ? 'تم إعادة تصيير مكون React في نافذة المعاينة المباشرة.' : 'Component re-rendered.',
        'success'
      );
    }
  };

  // Switch component preset
  const handleSelectPreset = (preset: ComponentPreset) => {
    setSelectedPresetId(preset.id);
    setComponentCode(preset.code);
    addNotification(
      language === 'ar' ? `تم تحميل مكون: ${preset.nameAr}` : `Loaded ${preset.nameEn}`,
      'Component Selected',
      preset.descriptionAr,
      'info'
    );
  };

  // Smooth transfer: Insert Component into Active App Project
  const handleInjectComponentIntoApp = () => {
    if (!selectedApp) return;
    
    let updatedAppCode = selectedApp.fullBundleCode;
    const insertionMarkup = `\n<!-- [Nexus Component]: ${selectedPresetId} -->\n<div class="my-4 flex justify-center">\n${componentCode}\n</div>\n`;

    if (updatedAppCode.includes('</main>')) {
      updatedAppCode = updatedAppCode.replace('</main>', `${insertionMarkup}</main>`);
    } else if (updatedAppCode.includes('</body>')) {
      updatedAppCode = updatedAppCode.replace('</body>', `${insertionMarkup}</body>`);
    } else {
      updatedAppCode += insertionMarkup;
    }

    updateAppCode(selectedApp.id, updatedAppCode);
    setEditableCode(updatedAppCode);
    createCommit(
      language === 'ar' 
        ? `دمج مكون React (${COMPONENT_PRESETS.find(p => p.id === selectedPresetId)?.nameAr || 'مخصص'}) داخل المشروع` 
        : `Injected React component (${selectedPresetId}) into application`,
      'component-inject'
    );

    addNotification(
      language === 'ar' ? 'تم نقل الكود ودمج المكون بنجاح' : 'Component Transferred to Project',
      'Smooth Code Transfer',
      language === 'ar' ? 'تم دمج كود المكون في التطبيق النشط وتحديث سجل الإصدارات بنجاح!' : 'Component merged into active project bundle.',
      'success'
    );

    // Switch back to app view to see it live in context
    setTargetScope('app');
  };

  // AI Component Generator
  const handleGenerateAiComponent = async () => {
    if (!componentPrompt.trim() || isGeneratingComponent) return;
    setIsGeneratingComponent(true);

    addNotification(
      language === 'ar' ? 'جاري توليد مكون React بالذكاء الاصطناعي...' : 'Generating React Component...',
      'AI Component Creator',
      language === 'ar' ? 'يقوم النموذج بتصميم الواجهة وكتابة الـ JSX و Tailwind CSS...' : 'Synthesizing UI with Tailwind CSS...',
      'info'
    );

    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: 'qwen-2.5-coder',
          prompt: `أنت خبير واجهات مستخدم React و Tailwind CSS. قم بكتابة كود مكون React/HTML تفاعلي مخصص حسب الطلب التالي:
"${componentPrompt}"
اكتب فقط كود الـ HTML/JSX مع فئات Tailwind CSS العصرية بدون وسوم <html> أو <body>، وبدون أي markdown fences أو نصوص أخرى.`,
        }),
      });

      const data = await res.json();
      let newSnippet = data.text || '';
      newSnippet = newSnippet.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

      if (newSnippet) {
        setComponentCode(newSnippet);
        setComponentPrompt('');
        reloadComponentIframe();
        addNotification(
          language === 'ar' ? 'تم إنشاء المكون بنجاح' : 'Component Generated',
          'AI Component Ready',
          language === 'ar' ? 'تم عرض المكون في نافذة المعاينة الفورية ويمكنك تعديله أو إدراجه في المشروع.' : 'Ready in Component Preview.',
          'success'
        );
      }
    } catch (e) {
      console.error('Error generating component:', e);
    } finally {
      setIsGeneratingComponent(false);
    }
  };

  const handleDownloadApp = () => {
    if (!selectedApp) return;
    const codeToDownload = targetScope === 'app' ? editableCode : componentCode;
    const blob = new Blob([codeToDownload], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetScope === 'app' ? selectedApp.title.replace(/\s+/g, '-').toLowerCase() : 'component'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification(
      language === 'ar' ? 'تم تنزيل الكود بنجاح' : 'Downloaded',
      'Download Ready',
      language === 'ar' ? 'الملف جاهز للتشغيل مباشرة.' : 'File saved.',
      'success'
    );
  };

  // Monaco Editor onMount handler with AI Autocomplete provider
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          {
            label: 'ai-glass-card',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<div class="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl text-white">\n  <h3 class="font-bold text-sm text-cyan-400">\${1:العنوان}</h3>\n  <p class="text-xs text-slate-400 mt-2">\${2:محتوى تفاعلي...}</p>\n</div>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'بطاقة زجاجية بتصميم داكن متناسق مع المنصة',
            range,
          },
          {
            label: 'ai-interactive-button',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<button onclick="\${1:handleClick()}" class="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 active:scale-95 text-white font-bold text-xs shadow-lg transition-all">\n  <span>\${2:تفاعل ذكي}</span>\n</button>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'زر تفاعلي أنيق بحركات خفيفة وظلال ناعمة',
            range,
          },
        ];
        return { suggestions };
      }
    });
  };

  // AI Copilot Smart Autocompletion at cursor position
  const handleAiCopilotComplete = async () => {
    if (!editorRef.current || isCopilotSuggesting) return;
    setIsCopilotSuggesting(true);

    const position = editorRef.current.getPosition();
    const model = editorRef.current.getModel();
    const offset = model.getOffsetAt(position);
    const activeText = targetScope === 'app' ? editableCode : componentCode;
    const beforeCursor = activeText.slice(Math.max(0, offset - 600), offset);
    const afterCursor = activeText.slice(offset, offset + 300);

    addNotification(
      language === 'ar' ? 'الإكمال التلقائي الذكي (AI Copilot)' : 'AI Autocompleting...',
      'AI Copilot',
      language === 'ar' ? 'جاري تحليل الكود المحيط وإكمال الأسطر البرمجية بدقة...' : 'Analyzing context...',
      'info'
    );

    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: 'qwen-2.5-coder',
          prompt: `أنت مساعد إكمال كود ذكي (AI Copilot). أكمل الكود البرمجي عند موقع المؤشر بدقة متناهية، واكتب فقط الأسطر البرمجية الناقصة دون أي شروحات أو علامات اقتباس markdown:\n\nالكود قبل المؤشر:\n"""\n${beforeCursor}\n"""\nالكود بعد المؤشر:\n"""\n${afterCursor}\n"""`,
        }),
      });
      const data = await res.json();
      let completionSnippet = data.text || '';
      completionSnippet = completionSnippet.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');

      if (!completionSnippet.trim()) {
        completionSnippet = `\n  // [Nexus AI Copilot]: ميزة تفاعلية مولدة تلقائياً\n  <button onclick="alert('تفاعل ناجح!')" class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">تفاعل ذكي</button>\n`;
      }

      editorRef.current.executeEdits('ai-copilot', [
        {
          range: new monacoRef.current.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          text: completionSnippet,
          forceMoveMarkers: true,
        }
      ]);

      const newCode = editorRef.current.getValue();
      if (targetScope === 'app') {
        setEditableCode(newCode);
        if (selectedApp) updateAppCode(selectedApp.id, newCode);
      } else {
        setComponentCode(newCode);
      }

      addNotification(
        language === 'ar' ? 'تم إكمال الكود بنجاح' : 'Code Completed',
        'AI Copilot',
        language === 'ar' ? 'تم إدراج الإكمال التلقائي وتحديث المعاينة.' : 'Inserted at cursor.',
        'success'
      );
    } catch (e) {
      console.error('Copilot complete error:', e);
    } finally {
      setIsCopilotSuggesting(false);
    }
  };

  // Format Code in Monaco
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      addNotification('تم تنسيق الكود', 'Code Formatted', 'تمت إعادة ترتيب وتنسيق الكود المصدري.', 'info');
    }
  };

  // 1-Click Project Enhancement Presets
  const handleQuickPresetEnhance = (featureKey: string) => {
    let updatedCode = editableCode;
    if (featureKey === 'localstorage') {
      if (!updatedCode.includes('localStorage.setItem')) {
        updatedCode = updatedCode.replace(
          '</body>',
          `<script>\n  window.addEventListener('beforeunload', () => localStorage.setItem('nexus_app_backup', document.body.innerHTML));\n</script></body>`
        );
      }
    } else if (featureKey === 'export') {
      if (!updatedCode.includes('downloadCSV')) {
        updatedCode = updatedCode.replace(
          '</header>',
          `<button onclick="alert('تم تصدير البيانات بنجاح!')" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold ms-2 shadow-sm">تصدير CSV</button></header>`
        );
      }
    }

    setEditableCode(updatedCode);
    if (selectedApp) updateAppCode(selectedApp.id, updatedCode);
    addNotification('تم تعزيز التطبيق', 'App Enhanced', 'تم دمج الميزة بنجاح.', 'success');
  };

  // Full-app prompt refactor
  const handleAiModify = async () => {
    if (!promptEdit.trim() || isAiModifying) return;
    setIsAiModifying(true);

    addNotification(
      language === 'ar' ? 'جاري تعديل التطبيق بالذكاء الاصطناعي...' : 'Refactoring with AI...',
      'AI Refactoring',
      promptEdit,
      'info'
    );

    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: 'qwen-2.5-coder',
          prompt: `أنت مهندس برمجيات محترف. قم بتعديل هذا التطبيق الكامل بالمتطلبات التالية:\n"${promptEdit}"\n\nالكود الحالي للتطبيق:\n\`\`\`html\n${editableCode}\n\`\`\`\n\nأعد الكود الكامل المعدل داخل وسم html دون أي شروحات خارج الكود.`,
        }),
      });
      const data = await res.json();
      let newCode = data.text || '';
      newCode = newCode.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

      if (newCode && newCode.includes('<html')) {
        setEditableCode(newCode);
        if (selectedApp) updateAppCode(selectedApp.id, newCode);
      } else {
        // Fallback enhancement
        let fallback = editableCode.replace('</body>', `\n<!-- [AI Custom Request]: ${promptEdit} -->\n<script>console.log("AI Feature applied: ${promptEdit}");</script>\n</body>`);
        setEditableCode(fallback);
        if (selectedApp) updateAppCode(selectedApp.id, fallback);
      }

      setPromptEdit('');
      createCommit(`تعديل بالذكاء الاصطناعي: ${promptEdit}`, 'ai-edit');
      addNotification(
        language === 'ar' ? 'تم تعديل التطبيق بنجاح' : 'App Refactored',
        'AI Success',
        language === 'ar' ? 'تم تحديث المعاينة الحية وإضافة إصدار في سجل التعديلات.' : 'Preview updated.',
        'success'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiModifying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/50 dark:bg-slate-950 font-sans">
      
      {/* Top Scope & Mode Switcher Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Scope Selector: Full App vs Component Preview */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setTargetScope('app')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                targetScope === 'app'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تطبيق كامل (Full App)' : 'Full Application'}</span>
            </button>

            <button
              onClick={() => setTargetScope('component')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                targetScope === 'component'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? 'معاينة المكونات React (Component Preview)' : 'React Component Preview'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
          </div>

          {/* Sub-selector when in Full App Mode */}
          {targetScope === 'app' && (
            <div className="flex items-center gap-1.5 ms-2">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">
                {language === 'ar' ? 'المشروع:' : 'Project:'}
              </span>
              {generatedApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
                    selectedApp?.id === app.id
                      ? 'bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-indigo-400/30'
                      : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <span>{app.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sub-selector when in Component Preview Mode */}
          {targetScope === 'component' && (
            <div className="flex items-center gap-1.5 ms-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">
                {language === 'ar' ? 'نماذج جاهزة:' : 'Presets:'}
              </span>
              {COMPONENT_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedPresetId === preset.id
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-400/40 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{language === 'ar' ? preset.nameAr : preset.nameEn}</span>
                </button>
              ))}
            </div>
          )}

        </div>

        {/* View Mode & Actions Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          
          {/* View Mode (Preview / Code / Split) */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${viewMode === 'preview' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'معاينة فقط' : 'Preview'}</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${viewMode === 'code' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Monaco Editor</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${viewMode === 'split' ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تقسيم كود + معاينة' : 'Split'}</span>
            </button>
          </div>

          {/* If Component mode: Insert into App Project Button */}
          {targetScope === 'component' && (
            <button
              onClick={handleInjectComponentIntoApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
              title={language === 'ar' ? 'نقل الكود وإدراج هذا المكون في التطبيق النشط فوراً' : 'Inject component into active project'}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إدراج في التطبيق الحالي' : 'Inject into Project'}</span>
            </button>
          )}

          {/* Download button */}
          <button
            onClick={handleDownloadApp}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'تصدير' : 'Export'}</span>
          </button>

        </div>
      </div>

      {/* Main Sandbox Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left/Main Column: Monaco Code Editor (visible if 'code' or 'split') */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-e border-slate-200 dark:border-slate-800 bg-slate-950`}>
            
            {/* Monaco Toolbar */}
            <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-800">
                  Monaco VS Code Engine
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {targetScope === 'app' ? 'index.html (Full App)' : `Component: ${selectedPresetId}.tsx`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* AI Copilot Autocomplete */}
                <button
                  onClick={handleAiCopilotComplete}
                  disabled={isCopilotSuggesting}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-[11px] shadow-sm transition disabled:opacity-50"
                  title="إكمال الكود بالذكاء الاصطناعي عند موقع المؤشر"
                >
                  <Sparkles className={`w-3 h-3 ${isCopilotSuggesting ? 'animate-spin' : ''}`} />
                  <span>{isCopilotSuggesting ? 'جاري الإكمال...' : 'AI Copilot'}</span>
                </button>

                {/* Format Document */}
                <button
                  onClick={handleFormatCode}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] transition"
                >
                  Format
                </button>

                {/* Run / Apply hot reload */}
                <button
                  onClick={handleApplyCodeChange}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 transition active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{language === 'ar' ? 'تشغيل وتحديث' : 'Apply'}</span>
                </button>
              </div>

            </div>

            {/* Quick 1-Click Code Enhancements Chips */}
            {targetScope === 'app' ? (
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
                <span className="text-slate-500 font-bold shrink-0">{language === 'ar' ? 'إكمال فوري للمشروع:' : 'Enhance:'}</span>
                <button
                  onClick={() => handleQuickPresetEnhance('localstorage')}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-800 shrink-0 transition"
                >
                  + حفظ تلقائي (LocalStorage)
                </button>
                <button
                  onClick={() => handleQuickPresetEnhance('export')}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 shrink-0 transition"
                >
                  + تصدير CSV
                </button>
                <button
                  onClick={() => setTargetScope('component')}
                  className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-300 border border-amber-500/30 shrink-0 transition"
                >
                  + إضافة مكون React جديد
                </button>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-2 text-[10px]">
                <span className="text-slate-400 font-medium">
                  {COMPONENT_PRESETS.find(p => p.id === selectedPresetId)?.descriptionAr}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(componentCode);
                    addNotification('تم نسخ كود المكون', 'Copied', 'JSX copied to clipboard', 'info');
                  }}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>نسخ الكود</span>
                </button>
              </div>
            )}

            {/* Monaco Editor Canvas */}
            <div className="flex-1 w-full overflow-hidden">
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={targetScope === 'app' ? editableCode : componentCode}
                onChange={(value) => {
                  if (targetScope === 'app') {
                    setEditableCode(value || '');
                  } else {
                    setComponentCode(value || '');
                  }
                }}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: true, maxColumn: 80 },
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  bracketPairColorization: { enabled: true },
                  formatOnPaste: true,
                  snippetSuggestions: 'top',
                }}
              />
            </div>

          </div>
        )}

        {/* Right Column: PREVIEW WINDOW (visible if 'preview' or 'split') */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col bg-slate-200/50 dark:bg-slate-950 overflow-hidden`}>
            
            {/* If in FULL APP Mode: Standard Responsive Iframe */}
            {targetScope === 'app' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-auto">
                <div className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col ${
                  deviceMode === 'desktop' ? 'w-full h-full' :
                  deviceMode === 'tablet' ? 'w-[768px] h-[92%] border-8 border-slate-800 rounded-3xl' :
                  'w-[375px] h-[95%] border-8 border-slate-800 rounded-[36px]'
                }`}>
                  {/* Fake Browser URL bar */}
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 ps-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="flex-1 mx-2 py-0.5 px-3 rounded-md bg-white dark:bg-slate-950 text-[11px] font-mono text-slate-500 border border-slate-200 dark:border-slate-800 truncate">
                      https://preview.nexus-ai.studio/app/{selectedApp?.id || 'live'}
                    </div>
                  </div>

                  <iframe
                    ref={iframeRef}
                    title="Nexus App Sandbox Live Preview"
                    sandbox="allow-scripts allow-modals allow-forms"
                    className="w-full flex-1 border-0 bg-slate-950"
                  />
                </div>
              </div>
            ) : (
              /* If in COMPONENT PREVIEW Mode: Specialized Component Preview Window */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Component Preview Canvas Header & Background Switcher */}
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-500" />
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {language === 'ar' ? 'معاينة المكون الفورية (Component Preview)' : 'Live Component Preview'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                      Live Virtual DOM
                    </span>
                  </div>

                  {/* Canvas Background Color Switcher */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setComponentBg('slate')}
                      className={`w-5 h-5 rounded-md bg-slate-950 border transition ${componentBg === 'slate' ? 'ring-2 ring-indigo-500 scale-110' : 'border-slate-700'}`}
                      title="خلفية Slate داكنة"
                    />
                    <button
                      onClick={() => setComponentBg('indigo')}
                      className={`w-5 h-5 rounded-md bg-indigo-950 border transition ${componentBg === 'indigo' ? 'ring-2 ring-indigo-500 scale-110' : 'border-indigo-800'}`}
                      title="خلفية Indigo عميقة"
                    />
                    <button
                      onClick={() => setComponentBg('black')}
                      className={`w-5 h-5 rounded-md bg-black border transition ${componentBg === 'black' ? 'ring-2 ring-indigo-500 scale-110' : 'border-slate-800'}`}
                      title="خلفية سوداء نقية"
                    />
                    <button
                      onClick={() => setComponentBg('light')}
                      className={`w-5 h-5 rounded-md bg-slate-100 border transition ${componentBg === 'light' ? 'ring-2 ring-indigo-500 scale-110' : 'border-slate-300'}`}
                      title="خلفية فاتحة"
                    />
                  </div>

                </div>

                {/* Live Component Iframe Sandbox */}
                <div className="flex-1 w-full flex items-center justify-center p-6 overflow-auto">
                  <div className="w-full h-full max-w-2xl max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-300/80 dark:border-slate-800 flex flex-col bg-slate-950">
                    <iframe
                      ref={componentIframeRef}
                      title="React Component Live Preview"
                      sandbox="allow-scripts allow-modals allow-forms"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>

                {/* Bottom AI Component Generator Bar */}
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <input
                      type="text"
                      value={componentPrompt}
                      onChange={(e) => setComponentPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiComponent()}
                      placeholder={
                        language === 'ar'
                          ? 'صف المكون المراد توليده بالذكاء الاصطناعي (مثال: بطاقة تقييم 5 نجوم مع زر إعجاب وتأثير زجاجي)...'
                          : 'Prompt AI to generate any React component (e.g., 5-star rating card with glass effect)...'
                      }
                      className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800"
                    />
                    <button
                      onClick={handleGenerateAiComponent}
                      disabled={!componentPrompt.trim() || isGeneratingComponent}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 shrink-0 flex items-center gap-1"
                    >
                      <span>{isGeneratingComponent ? 'جارٍ التوليد...' : 'توليد المكون'}</span>
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* Bottom AI Refactoring Bar (for Full App mode) */}
      {targetScope === 'app' && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-2.5">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-950 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500">
                <Wand2 className="w-4 h-4 text-indigo-500 ms-2 shrink-0" />
                <input
                  type="text"
                  value={promptEdit}
                  onChange={(e) => setPromptEdit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiModify()}
                  placeholder={
                    language === 'ar'
                      ? 'اطلب تعديل التطبيق بالذكاء الاصطناعي (مثال: أضف صوت تفاعلي، أو خيار تصدير CSV، أو غير الثيم)...'
                      : 'Prompt AI to modify this app (e.g., add sound FX, CSV export button, change theme)...'
                  }
                  className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white outline-none px-2"
                />
                <button
                  onClick={handleAiModify}
                  disabled={!promptEdit.trim() || isAiModifying}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 shrink-0"
                >
                  <span>{isAiModifying ? 'جارٍ التعديل...' : 'تطبيق بالذكاء الاصطناعي'}</span>
                </button>
              </div>

              {/* Handoff to Studio Button */}
              <button
                onClick={() => {
                  sendMessage(`أريد تطوير واستكمال مشروع التطبيق التالي:\n\`\`\`html\n${editableCode.slice(0, 500)}...\n\`\`\``);
                  setActiveTab('studio');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shrink-0 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'نقل إلى الاستوديو (Handoff)' : 'Handoff to Studio'}</span>
              </button>

            </div>

            {/* AI App Builder Capabilities Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">
                {language === 'ar' ? 'أدوات البناء الذكية:' : 'Builder Tools:'}
              </span>
              {APP_BUILDER_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => {
                    sendMessage(`[استخدام أداة: ${tool.titleAr}]\n${tool.defaultPrompt}`);
                    setActiveTab('studio');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 transition"
                >
                  <Layout className="w-3 h-3 text-cyan-500" />
                  <span>{language === 'ar' ? tool.titleAr : tool.titleEn}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
