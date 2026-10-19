import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Share2, 
  GitCommit, 
  Bookmark, 
  Copy, 
  Check, 
  Volume2, 
  SlidersHorizontal, 
  Trash2, 
  Zap, 
  ArrowRightLeft, 
  Code2, 
  Cpu, 
  Eye, 
  Mic, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Layers,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModelCategory } from '../../types';
import { AnimatedCodingModel } from '../Visualizer/AnimatedCodingModel';

export const UnifiedStudio: React.FC = () => {
  const { 
    language, 
    models, 
    selectedModel, 
    setSelectedModelId, 
    messages, 
    sendMessage, 
    isGenerating,
    openHandoffModal,
    createCommit,
    addAsset,
    clearWorkspace,
    systemInstruction,
    setSystemInstruction,
    temperature,
    setTemperature,
    assets,
    addNotification,
    createNewApp,
    setActiveTab,
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfig, setShowConfig] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [showCodingHologram, setShowCodingHologram] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!inputPrompt.trim() || isGenerating) return;
    sendMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToAssets = (content: string, modelName: string) => {
    addAsset({
      title: `مخرجات ${modelName} - ${new Date().toLocaleTimeString()}`,
      category: 'code',
      content,
      description: `مخرجات محفوظة من جلسة الاستوديو الموحد.`,
      tags: [modelName, 'StudioOutput'],
      sizeKb: Math.max(1, Math.round(content.length / 1024)),
      author: 'المستخدم الحالي',
    });
  };

  const handleQuickCommit = (content: string, modelName: string) => {
    createCommit(`حفظ يدوي لمخرجات ${modelName}`, `snapshot-${Date.now().toString(36).slice(-3)}`);
    addNotification('تم إنشاء نقطة حفظ', 'Snapshot Committed', 'تم تسجيل هذه النقطة في سجل الإصدارات بنجاح.', 'Version snapshot successfully recorded.', 'success');
  };

  const handleInjectAsset = (assetContent: string) => {
    setInputPrompt(prev => prev ? `${prev}\n\n${assetContent}` : assetContent);
    setShowAssetSelector(false);
  };

  const filteredModels = selectedCategory === 'all' 
    ? models 
    : models.filter(m => m.category === selectedCategory);

  const categories: { id: string; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'جميع النماذج (8)', labelEn: 'All Models (8)' },
    { id: 'llm', labelAr: 'محادثة وتفكير (LLM)', labelEn: 'General & LLMs' },
    { id: 'reasoning', labelAr: 'استدلال عميق (Reasoning)', labelEn: 'Deep Reasoning' },
    { id: 'coding', labelAr: 'برمجة وهندسة (Coding)', labelEn: 'Coding Specialists' },
    { id: 'vision', labelAr: 'رؤية وتوليد صور (Vision)', labelEn: 'Vision & Images' },
    { id: 'audio', labelAr: 'صوت وتفريغ (Audio)', labelEn: 'Audio & Speech' },
  ];

  const quickPrompts = [
    { ar: 'واصل العمل من آخر نقطة توقف بدقة', en: 'Continue from the last stopping point' },
    { ar: 'حول هذا الحل إلى كود TypeScript تنفيذي', en: 'Convert this solution into executable TypeScript' },
    { ar: 'قم بتدقيق الكود واكتشاف الثغرات الأمنية', en: 'Audit the code and detect security vulnerabilities' },
    { ar: 'لخص النتائج في 3 نقاط رئيسية', en: 'Summarize results into 3 key takeaways' },
    { ar: 'ولد وصفاً بصرياً دقيقاً لنموذج FLUX', en: 'Generate a rich prompt for FLUX.1 image synthesis' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/50 dark:bg-slate-950">
      
      {/* Top Model Selector Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm p-3 sm:px-6">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Models Carousel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {filteredModels.map(m => {
            const isSelected = selectedModel.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModelId(m.id)}
                className={`cursor-pointer p-2 rounded-xl border text-start transition-all relative group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[11px] truncate text-slate-900 dark:text-white">
                    {m.name.split(' ')[0]} {m.name.split(' ')[1] || ''}
                  </span>
                  {m.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-semibold truncate">
                      {m.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{m.provider.split(' ')[0]}</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{language === 'ar' ? m.speedRating : m.speedRatingEn}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Model Capabilities Banner */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white">{selectedModel.name}</span>
            <span>•</span>
            <span className="hidden sm:inline">{language === 'ar' ? selectedModel.descriptionAr : selectedModel.descriptionEn}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodingHologram(!showCodingHologram)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                showCodingHologram
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title={language === 'ar' ? 'إظهار/إخفاء النموذج البرمجي المتحرك' : 'Toggle Animated Coding Matrix'}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نموذج البرمجة المتحرك' : 'Coding Hologram'}</span>
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إعدادات النموذج' : 'Model Parameters'}</span>
            </button>
            <button
              onClick={clearWorkspace}
              title={language === 'ar' ? 'مسح المحادثة' : 'Clear Workspace'}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Model Parameters Drawer */}
        {showConfig && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'ar' ? 'تعليمات النظام (System Instruction):' : 'System Instruction:'}
              </label>
              <input
                type="text"
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                placeholder="أدخل توجيهات النظام للنموذج..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'درجة الإبداع (Temperature):' : 'Temperature:'}
                </label>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{language === 'ar' ? 'دقيق ومنطقي (0.0)' : 'Precise (0.0)'}</span>
                <span>{language === 'ar' ? 'إبداعي واستكشافي (1.0)' : 'Creative (1.0)'}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Messages Workspace Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        
        {/* Animated Coding Model Widget */}
        {showCodingHologram && (
          <div className="max-w-4xl mx-auto w-full mb-2 animate-in fade-in zoom-in-95 duration-200">
            <AnimatedCodingModel />
          </div>
        )}
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-4 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              {language === 'ar' ? 'استوديو الذكاء الاصطناعي الموحد' : 'Unified AI Model Studio'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {language === 'ar'
                ? 'استخدم أي نموذج مجاني، وعند التوقف يمكنك بضغطة زر ترحيل السياق ومواصلة العمل عبر نموذج آخر دون فقدان أي بيانات.'
                : 'Interact with top free AI models, and hand off active context at any moment to another specialized engine seamlessly.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-start">
              {quickPrompts.slice(0, 4).map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setInputPrompt(language === 'ar' ? qp.ar : qp.en)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-400 text-xs text-slate-700 dark:text-slate-300 transition text-start"
                >
                  {language === 'ar' ? qp.ar : qp.en}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const modelInfo = models.find(m => m.id === msg.modelId);
            
            // Extract DeepSeek <think> reasoning if present
            let reasoningPart = '';
            let contentPart = msg.content;
            if (msg.content.includes('<think>')) {
              const startIdx = msg.content.indexOf('<think>') + 7;
              const endIdx = msg.content.indexOf('</think>');
              if (endIdx > -1) {
                reasoningPart = msg.content.substring(startIdx, endIdx).trim();
                contentPart = msg.content.substring(endIdx + 8).trim();
              }
            }

            const isThoughtOpen = expandedThoughts[msg.id] ?? false;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-4xl mx-auto w-full`}
              >
                {/* Handoff Trace Banner if this message resulted from a cross-model handoff */}
                {msg.handoffTrace && (
                  <div className="w-full mb-2 p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-cyan-400/40 dark:border-cyan-600/30 text-xs shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{language === 'ar' ? 'سجل ترحيل سياق العمل' : 'Cross-Model Hand-off Trace'}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                            {language === 'ar' ? msg.handoffTrace.goalLabelAr : msg.handoffTrace.goalLabelEn}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {language === 'ar'
                            ? `تم استلام العمل من [${msg.handoffTrace.sourceModel}] ومتابعته عبر [${msg.handoffTrace.targetModel}] دون انقطاع.`
                            : `Seamlessly transferred from [${msg.handoffTrace.sourceModel}] to [${msg.handoffTrace.targetModel}].`}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-white/60 dark:bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                      {msg.handoffTrace.transferredTokens} {language === 'ar' ? 'رمز منقول' : 'tokens transferred'}
                    </span>
                  </div>
                )}

                {/* Message Content Container */}
                <div
                  className={`w-full rounded-2xl p-4 sm:p-5 transition-shadow ${
                    isUser
                      ? 'bg-indigo-600 text-white max-w-2xl ms-auto rounded-te-xs shadow-md shadow-indigo-600/10'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-ts-xs shadow-sm'
                  }`}
                >
                  {/* Assistant Header with Provider & Model */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {modelInfo ? modelInfo.name.charAt(0) : 'A'}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {msg.provider || modelInfo?.name || 'الذكاء الاصطناعي'}
                          </span>
                          {msg.latencyMs && (
                            <span className="ms-2 text-[10px] text-slate-400 font-mono">
                              ({msg.latencyMs}ms • {msg.tokens || 0} tok)
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  {/* DeepSeek Reasoning Dropdown if available */}
                  {reasoningPart && (
                    <div className="mb-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 overflow-hidden text-xs">
                      <button
                        onClick={() => setExpandedThoughts(prev => ({ ...prev, [msg.id]: !isThoughtOpen }))}
                        className="w-full flex items-center justify-between p-2.5 font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100/50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'سلسلة التفكير والاستدلال المنطقي (DeepSeek Thoughts)' : 'Reasoning Chain (<think>)'}</span>
                        </div>
                        {isThoughtOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {isThoughtOpen && (
                        <div className="p-3 border-t border-amber-200 dark:border-amber-900/60 font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 bg-amber-50/30 dark:bg-amber-950/10">
                          {reasoningPart}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Message Text with Markdown / Code rendering */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {contentPart}
                  </div>

                  {/* Visual Artifact Mock if present (e.g. FLUX.1) */}
                  {msg.artifact && msg.artifact.type === 'image' && (
                    <div className="mt-4 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20">
                      <div className="flex items-center gap-2 mb-2 font-bold text-xs text-indigo-700 dark:text-indigo-300">
                        <ImageIcon className="w-4 h-4" />
                        <span>{language === 'ar' ? 'المفهوم البصري المولد (FLUX Schnell)' : 'Generated Visual Concept (FLUX Schnell)'}</span>
                      </div>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                          <Sparkles className="w-6 h-6 animate-spin" />
                        </div>
                        <h6 className="font-bold text-white text-sm mb-1">
                          {language === 'ar' ? 'تصور ثلاثي الأبعاد للمنصة الموحدة' : 'Unified AI 3D Command Nexus'}
                        </h6>
                        <p className="text-[11px] text-slate-400 max-w-sm">
                          {language === 'ar'
                            ? 'تمت مطابقة الأبعاد 1024x1024 والتوليد بدقة 8k وحفظه في المكتبة المشتركة.'
                            : 'Synthesized with 8k photorealistic Octane render and cached in Shared Library.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Message Action Bar for Assistants (Cross-Model Hand-off, Commit, Save, Copy) */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      
                      {/* PRIMARY ACTION: Hand-off to another model */}
                      <button
                        onClick={() => openHandoffModal(msg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'ترحيل إلى نموذج آخر' : 'Hand off to Model'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Quick Sandbox Preview button if message contains code */}
                        {msg.content.includes('```') && (
                          <button
                            onClick={() => {
                              createNewApp(`تطبيق مولد - ${msg.provider || 'AI'}`, 'تطبيق تم استخراجه من مخرجات الاستوديو', msg.content, 'custom');
                              setActiveTab('builder');
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition font-bold"
                            title={language === 'ar' ? 'معاينة وتشغيل هذا التطبيق في Sandbox' : 'Run in Live Sandbox'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'معاينة حية' : 'Live Preview'}</span>
                          </button>
                        )}

                        {/* Quick Commit button */}
                        <button
                          onClick={() => handleQuickCommit(msg.content, msg.provider || 'AI')}
                          title={language === 'ar' ? 'حفظ كنقطة في سجل الإصدارات' : 'Commit as Version'}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <GitCommit className="w-3.5 h-3.5 text-amber-500" />
                          <span className="hidden sm:inline">{language === 'ar' ? 'حفظ إصدار' : 'Commit'}</span>
                        </button>

                        {/* Save to shared asset library */}
                        <button
                          onClick={() => handleSaveToAssets(msg.content, msg.provider || 'AI')}
                          title={language === 'ar' ? 'إضافة إلى المكتبة السحابية المشتركة' : 'Save to Asset Library'}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="hidden sm:inline">{language === 'ar' ? 'حفظ بالمكتبة' : 'Bookmark'}</span>
                        </button>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title={language === 'ar' ? 'نسخ النص' : 'Copy'}
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? `جاري المعالجة عبر ${selectedModel.name}...` : `Processing with ${selectedModel.name}...`}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'توليد المخرجات وحساب فروقات الرموز لحظياً' : 'Generating output and calculating token diff'}
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Action & Prompt Area */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-2.5">
          
          {/* Quick Continuation Suggestions Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">
              {language === 'ar' ? 'أوامر سريعة:' : 'Quick Prompts:'}
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => setInputPrompt(language === 'ar' ? qp.ar : qp.en)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 transition"
              >
                {language === 'ar' ? qp.ar : qp.en}
              </button>
            ))}
          </div>

          {/* Main Input Textarea Bar */}
          <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2 flex flex-col gap-2">
            
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                language === 'ar'
                  ? `اسأل ${selectedModel.name} أو اطلب متابعة العمل من مكان التوقف...`
                  : `Ask ${selectedModel.name} or request cross-model handoff...`
              }
              rows={2}
              className="w-full resize-none bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 px-2 py-1"
            />

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
              
              {/* Asset Library Injector Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAssetSelector(!showAssetSelector)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{language === 'ar' ? 'إرفاق من المكتبة' : 'Attach Asset'}</span>
                </button>

                {showAssetSelector && (
                  <div className="absolute bottom-full mb-2 start-0 w-72 rounded-xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 z-30">
                    <div className="font-bold text-xs p-1 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 mb-1">
                      {language === 'ar' ? 'اختر قالباً أو مورداً من المكتبة:' : 'Select Library Template:'}
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {assets.map(a => (
                        <div
                          key={a.id}
                          onClick={() => handleInjectAsset(a.content)}
                          className="p-2 rounded-lg text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                        >
                          <div className="font-bold text-slate-900 dark:text-slate-100">{a.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{a.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Character & Token Estimate */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  ~{Math.round((inputPrompt.length || 0) / 3.5)} {language === 'ar' ? 'رمز' : 'tokens'}
                </span>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputPrompt.trim() || isGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{language === 'ar' ? 'إرسال' : 'Send'}</span>
                  <Send className="w-3.5 h-3.5 rotate-180 rtl:rotate-0" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
