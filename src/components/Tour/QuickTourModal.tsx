import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Share2, 
  GitBranch, 
  FolderGit2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickTourModal: React.FC = () => {
  const { language, isQuickTourOpen, setIsQuickTourOpen, setActiveTab } = useApp();

  const [step, setStep] = useState(0);

  if (!isQuickTourOpen) return null;

  const steps = [
    {
      titleAr: 'مرحباً بك في NexusAI: منصة الذكاء الاصطناعي الموحدة',
      titleEn: 'Welcome to NexusAI: Unified AI Studio',
      descAr: 'تجمع المنصة كافة نماذج وأدوات الذكاء الاصطناعي الرائدة والمجانية (Google Gemini, DeepSeek-R1, Qwen Coder, Meta Llama, FLUX) في تطبيق عملي واحد وسلس.',
      descEn: 'Access the world’s top free & open AI models (Gemini, DeepSeek-R1, Qwen Coder, Llama 3.3, FLUX.1) in one unified interface.',
      icon: Cpu,
      badgeAr: 'النسخة التجريبية المجانية الشاملة',
      badgeEn: 'Full Free-Tier Access',
    },
    {
      titleAr: 'متابعة العمل من مكان التوقف (Cross-Model Hand-off)',
      titleEn: 'Cross-Model Seamless Hand-off',
      descAr: 'الميزة الأقوى: يمكنك البدء في نموذج (مثل التفكير في DeepSeek)، وبضغطة زر ترحيل السياق ومتابعة العمل عبر نموذج آخر (مثل البرمجة في Qwen أو التوليد البصري في FLUX) دون أي انقطاع.',
      descEn: 'Transfer active context from one model to another with a single click — continuing output generation from where the previous engine stopped.',
      icon: Share2,
      badgeAr: 'تزامن لحظي للبيانات',
      badgeEn: 'Zero Context Loss',
    },
    {
      titleAr: 'نظام إدارة الإصدارات المركزي ومستعرض الفروقات (VCS)',
      titleEn: 'Centralized VCS & Visual Diff Inspector',
      descAr: 'يتم توثيق كافة التعديلات والترحيلات كنقاط حفظ زمنية (Commits). يمكنك مقارنة التغييرات بصرياً (Diff) والرجوع لأي إصدار سابق بضغطة زر واحدة.',
      descEn: 'Track every prompt and output revision like Git commits, view visual line diffs, and perform 1-click state rollbacks.',
      icon: GitBranch,
      badgeAr: 'تتبع شامل للتعديلات',
      badgeEn: 'Audit Trail',
    },
    {
      titleAr: 'المكتبة السحابية، العمل دون اتصال، والتشفير التام',
      titleEn: 'Shared Cloud Library, Offline Mode & Encryption',
      descAr: 'مكتبة مشتركة للأوامر والموارد، دعم العمل أوفلاين مع المزامنة التلقائية فور عودة الاتصال، وحماية البيانات بتشفير AES-256 المتطور والمصادقة الثنائية.',
      descEn: 'Shared templates, offline-first sync queue, Google Drive & Dropbox integrations, and end-to-end AES-256 protection.',
      icon: ShieldCheck,
      badgeAr: 'أمان وتكامل كامل',
      badgeEn: 'Enterprise Ready',
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  const handleFinish = () => {
    setIsQuickTourOpen(false);
    setActiveTab('studio');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-transparent">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {language === 'ar' ? current.badgeAr : current.badgeEn}
          </span>
          <button
            onClick={() => setIsQuickTourOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Icon className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {language === 'ar' ? current.titleAr : current.titleEn}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {language === 'ar' ? current.descAr : current.descEn}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-indigo-600 dark:bg-indigo-400' : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 disabled:opacity-30"
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
            >
              <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'ar' ? 'ابدأ العمل الآن' : 'Get Started'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
