import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Search, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Filter, 
  Copy, 
  Check, 
  Layers, 
  Globe, 
  Share2, 
  Code2, 
  Cpu, 
  Play, 
  Tag, 
  Flame,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { TOLZY_AI_TOOLS } from '../../data/tolzyTools';
import { useApp } from '../../context/AppContext';
import { TolzyAITool } from '../../types';

export const TolzyToolsView: React.FC = () => {
  const { language, sendMessage, setActiveTab, addNotification, setSelectedModelId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<'all' | 'free' | 'freemium' | 'open-source'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelAr: 'كافة الأدوات', labelEn: 'All Tools' },
    { id: 'tolzy', labelAr: '👑 منظومة تولزي الأصلية', labelEn: '👑 Tolzy Native' },
    { id: 'coding', labelAr: '💻 البرمجة وهندسة النظم', labelEn: '💻 Coding & Dev' },
    { id: 'productivity', labelAr: '⚡ الإنتاجية والجداول والبريد', labelEn: '⚡ Productivity & Data' },
    { id: 'vision', labelAr: '🎨 التصميم والرسم والفيكتور', labelEn: '🎨 Design & Vision' },
    { id: 'audio', labelAr: '🎵 الصوت والموسيقى والدبلجة', labelEn: '🎵 Audio & Music' },
    { id: 'video', labelAr: '🎬 صناعة الفيديو والسينما', labelEn: '🎬 Video & Motion' },
    { id: 'writing', labelAr: '✍️ الكتابة وصناعة المحتوى', labelEn: '✍️ Writing & Content' },
    { id: 'research', labelAr: '🔬 البحث الأكاديمي والعلمي', labelEn: '🔬 Research & Science' },
    { id: 'learning', labelAr: '📚 التعلم والأكاديميات', labelEn: '📚 Learning & EdTech' },
  ];

  const filteredTools = useMemo(() => {
    return TOLZY_AI_TOOLS.filter((tool) => {
      // Category filter
      if (selectedCategory === 'tolzy') {
        const isTolzy = tool.tags.some(t => t.toLowerCase().includes('tolzy')) || tool.id.startsWith('tolzy');
        if (!isTolzy) return false;
      } else if (selectedCategory !== 'all') {
        if (tool.category !== selectedCategory) return false;
      }

      // Pricing filter
      if (selectedPricing !== 'all' && tool.pricing !== selectedPricing) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDescAr = tool.descriptionAr.toLowerCase().includes(q);
        const matchDescEn = tool.descriptionEn.toLowerCase().includes(q);
        const matchCatAr = tool.categoryAr.toLowerCase().includes(q);
        const matchCatEn = tool.categoryEn.toLowerCase().includes(q);
        const matchTags = tool.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDescAr && !matchDescEn && !matchCatAr && !matchCatEn && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedPricing]);

  // Launch tool workflow in Unified Studio
  const handleLaunchInStudio = (tool: TolzyAITool) => {
    const prompt = 
      language === 'ar'
        ? `أريد الاستفادة من إمكانيات أداة (${tool.name}) المتخصصة في [${tool.categoryAr}].
وصف الأداة: ${tool.descriptionAr}
المهمة المطلوبة: قدم لي خطة عمل تنفيذية وكوداً أو مخرجات جاهزة للإنتاج متوافقة مع هذه الأداة.`
        : `I want to leverage (${tool.name}) specialized in [${tool.categoryEn}].
Tool description: ${tool.descriptionEn}
Task: Provide a concrete, production-ready execution plan and deliverables suited for this tool.`;

    // Match best model for tool category
    if (tool.category === 'coding') {
      setSelectedModelId('qwen-2.5-coder');
    } else if (tool.category === 'vision') {
      setSelectedModelId('gemini-3.8-flash');
    } else {
      setSelectedModelId('gemini-3.8-flash');
    }

    sendMessage(prompt);
    setActiveTab('studio');
    addNotification(
      language === 'ar' ? `تم تفعيل سياق ${tool.name}` : `Activated ${tool.name}`,
      `Launched in Studio`,
      language === 'ar' ? 'تم تحويلك إلى الاستوديو الموحد لتنفيذ مهام هذه الأداة مع النموذج الأنسب.' : 'Redirected to Unified Studio with context.',
      'info'
    );
  };

  // Copy prompt or link
  const handleCopyPrompt = (tool: TolzyAITool) => {
    const snippet = `[Nexus AI x Tolzy Tool: ${tool.name}]\nرابط الأداة: ${tool.url}\nالحصة المجانية: ${tool.freeAllowanceAr}\nالاستخدام الموصى به: ${tool.descriptionAr}`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2000);
    addNotification(
      language === 'ar' ? 'تم نسخ بيانات الأداة' : 'Tool Details Copied',
      'Copied to Clipboard',
      tool.name,
      'success'
    );
  };

  // Stats
  const totalCount = TOLZY_AI_TOOLS.length;
  const tolzyCount = TOLZY_AI_TOOLS.filter(t => t.tags.includes('Tolzy')).length;
  const freeCount = TOLZY_AI_TOOLS.filter(t => t.pricing === 'free' || t.pricing === 'open-source').length;
  const freemiumCount = TOLZY_AI_TOOLS.filter(t => t.pricing === 'freemium').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">

        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 border border-indigo-700/40 p-6 sm:p-8 shadow-2xl text-white">
          <div className="absolute top-0 end-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>
                  {language === 'ar' 
                    ? 'دليل أدوات تولزي الشامل (Tolzy.me/tools)' 
                    : 'Comprehensive Tolzy AI Tools Directory'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-emerald-300 font-mono">100% Verified</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {language === 'ar' ? (
                  <>
                    كافة أدوات ونماذج <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-400">الذكاء الاصطناعي المجانية</span> في مكان واحد
                  </>
                ) : (
                  <>
                    All Free AI Tools & Models from <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-400">Tolzy.me</span> in One Hub
                  </>
                )}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                {language === 'ar'
                  ? 'تم دمج كافة أدوات منصة Tolzy.me والأدوات البرمجية، البصرية، الإنتاجية، وجداول البيانات في بيئة عمل موحدة مع إمكانية التشغيل السريع في الاستوديو ونقل السياق بين النماذج.'
                  : 'All AI tools from Tolzy.me integrated into a unified workspace. Execute instantly in the studio, hand off between models, and explore generous free quotas.'}
              </p>
            </div>

            {/* Official Link Badge & External Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href="https://tolzy.me/tools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'ar' ? 'زيارة موقع Tolzy.me/tools' : 'Visit Tolzy.me/tools'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveTab('builder')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ar' ? 'معاينة التطبيقات الناتجة' : 'Open App Sandbox'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                {totalCount}
              </div>
              <div>
                <p className="text-[11px] text-slate-400">{language === 'ar' ? 'إجمالي الأدوات المدعومة' : 'Total AI Tools'}</p>
                <p className="font-bold text-white text-sm">{totalCount} {language === 'ar' ? 'أداة ذكية' : 'Tools'}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                {tolzyCount}
              </div>
              <div>
                <p className="text-[11px] text-slate-400">{language === 'ar' ? 'منظومة تولزي الأصلية' : 'Tolzy Native Suite'}</p>
                <p className="font-bold text-white text-sm">{tolzyCount} {language === 'ar' ? 'تطبيقات رئيسية' : 'Native Apps'}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                {freeCount}
              </div>
              <div>
                <p className="text-[11px] text-slate-400">{language === 'ar' ? 'مجاني 100% ومفتوح' : '100% Free / Open'}</p>
                <p className="font-bold text-white text-sm">{freeCount} {language === 'ar' ? 'أداة ونموذج' : 'Models/Tools'}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                {freemiumCount}
              </div>
              <div>
                <p className="text-[11px] text-slate-400">{language === 'ar' ? 'حصص مجانية دورية' : 'Freemium Quota'}</p>
                <p className="font-bold text-white text-sm">{freemiumCount} {language === 'ar' ? 'أداة بخطة مجانية' : 'Freemium Tools'}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'ابحث بالاسم، التصنيف، الحصة المجانية، أو الوسوم (مثل: Tolzy, React, جرافيك, فيديو, برمجة)...'
                    : 'Search by tool name, allowance, tag, or category (e.g. Tolzy, React, Vector, Video)...'
                }
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] text-slate-400 hover:text-slate-600 px-1 font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Pricing Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-end sm:self-auto text-xs font-bold">
              <button
                onClick={() => setSelectedPricing('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedPricing === 'all'
                    ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSelectedPricing('open-source')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedPricing === 'open-source'
                    ? 'bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? 'مفتوح المصدر 100%' : 'Open Source'}
              </button>
              <button
                onClick={() => setSelectedPricing('free')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedPricing === 'free'
                    ? 'bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? 'مجاني بالكامل' : 'Free Forever'}
              </button>
              <button
                onClick={() => setSelectedPricing('freemium')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedPricing === 'freemium'
                    ? 'bg-white dark:bg-slate-950 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {language === 'ar' ? 'خطة مجانية' : 'Freemium'}
              </button>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter & Active Filter summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div>
            {language === 'ar' ? (
              <>
                عرض <span className="font-bold text-slate-900 dark:text-white">{filteredTools.length}</span> من أصل <span className="font-bold">{TOLZY_AI_TOOLS.length}</span> أداة ونموذج ذكاء اصطناعي
              </>
            ) : (
              <>
                Showing <span className="font-bold text-slate-900 dark:text-white">{filteredTools.length}</span> of <span className="font-bold">{TOLZY_AI_TOOLS.length}</span> AI tools & models
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-medium">{language === 'ar' ? 'كافة الأدوات مُحدثة ومتوافقة' : 'All tools up to date'}</span>
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const isTolzyNative = tool.tags.some(t => t.toLowerCase().includes('tolzy')) || tool.id.startsWith('tolzy');

            return (
              <div
                key={tool.id}
                className={`group relative rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between p-5 hover:shadow-xl hover:-translate-y-1 ${
                  isTolzyNative
                    ? 'border-amber-400/50 dark:border-amber-500/30 shadow-amber-500/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                {/* Card Top: Icon, Titles, Badges */}
                <div className="space-y-3">
                  
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.iconBg} text-white flex items-center justify-center font-bold text-base shadow-md group-hover:scale-105 transition shrink-0`}>
                        {isTolzyNative ? '⚡' : tool.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                            {tool.name}
                          </h3>
                          {tool.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[9px] font-bold">
                              {language === 'ar' ? 'مميز' : 'Featured'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {language === 'ar' ? tool.categoryAr : tool.categoryEn}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Badge */}
                    <div className="shrink-0 text-end">
                      <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        tool.pricing === 'open-source' 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40' :
                        tool.pricing === 'free'
                          ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300/40' :
                          'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300/40'
                      }`}>
                        {language === 'ar' ? tool.pricingLabelAr : tool.pricingLabelEn}
                      </span>
                      {tool.tolzyVerified && (
                        <div className="flex items-center justify-end gap-1 text-[10px] text-indigo-500 dark:text-indigo-400 mt-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Tolzy Verified</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Free Allowance Highlight Banner */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-[11px] flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {language === 'ar' ? 'الحصة المجانية: ' : 'Free Quota: '}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {language === 'ar' ? tool.freeAllowanceAr : tool.freeAllowanceEn}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {language === 'ar' ? tool.descriptionAr : tool.descriptionEn}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Card Actions Bottom */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  
                  {/* Studio / Launch button */}
                  <button
                    onClick={() => handleLaunchInStudio(tool)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-600/20 transition active:scale-95"
                    title={language === 'ar' ? 'تشغيل في الاستوديو الموحد' : 'Launch in Studio'}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'ar' ? 'تجربة بالاستوديو' : 'Run in Studio'}</span>
                  </button>

                  {/* Copy snippet button */}
                  <button
                    onClick={() => handleCopyPrompt(tool)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title={language === 'ar' ? 'نسخ بيانات وبرومبت الأداة' : 'Copy prompt template'}
                  >
                    {copiedId === tool.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Visit External Site */}
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    title={language === 'ar' ? 'فتح الموقع الرسمي' : 'Visit Official Website'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner for Ecosystem Integration */}
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'ar' 
                  ? 'ترابط ذكي وتزامن لحظي بين الأدوات والنماذج'
                  : 'Seamless Context Handoff Between All Tools'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar'
                  ? 'يمكنك نقل مخرجات أي أداة من أدوات تولزي إلى نموذج البرمجة أو توليد الصور أو استوديو التطبيقات بضغطة زر واحدة.'
                  : 'Handoff outputs from any Tolzy tool to coding models, image generators, or sandbox apps instantly.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('handoff')}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs whitespace-nowrap transition"
          >
            {language === 'ar' ? 'فتح مصفوفة الترحيل' : 'Open Handoff Hub'}
          </button>
        </div>

      </div>
    </div>
  );
};
