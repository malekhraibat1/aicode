import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  FileText, 
  BookOpen, 
  Sparkles,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExportModal: React.FC = () => {
  const { language, isExportModalOpen, setIsExportModalOpen, setIsVercelModalOpen, exportProjectData, addNotification } = useApp();

  const [format, setFormat] = useState<'json' | 'markdown' | 'notebook' | 'huggingface'>('json');
  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const content = exportProjectData(format);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      json: 'nexus-ai-project.json',
      markdown: 'nexus-ai-report.md',
      notebook: 'nexus-ai-session.ipynb',
      huggingface: 'nexus-ai-dataset.json',
    };

    const mimeTypes: Record<string, string> = {
      json: 'application/json',
      markdown: 'text/markdown',
      notebook: 'application/x-ipynb+json',
      huggingface: 'application/json',
    };

    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = extensions[format];
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification('تم تصدير المشروع بنجاح', 'Project Exported', `تم تنزيل الملف بصيغة ${format.toUpperCase()}`, `File downloaded in ${format.toUpperCase()} format`, 'success');
  };

  const formats = [
    {
      id: 'json',
      nameAr: 'تنسيق الذكاء الاصطناعي الشامل (Universal JSON)',
      nameEn: 'Universal AI Spec (.json)',
      descAr: 'يحتفظ بكافة الإصدارات، مسارات الترحيل، والأصول المشتركة.',
      descEn: 'Full state with VCS history, hand-off traces, and assets.',
      icon: FileJson,
    },
    {
      id: 'markdown',
      nameAr: 'مستند مشروع منسق (Markdown .md)',
      nameEn: 'Markdown Report (.md)',
      descAr: 'مستند نصي أنيق متوافق مع GitHub وNotion والمستندات التقنية.',
      descEn: 'Clean report compatible with GitHub, Obsidian, and Notion.',
      icon: FileText,
    },
    {
      id: 'notebook',
      nameAr: 'دفتر جوبيتر التفاعلي (Jupyter .ipynb)',
      nameEn: 'Jupyter Notebook (.ipynb)',
      descAr: 'جاهز للتشغيل مباشرة في Google Colab وبيئات Python.',
      descEn: 'Directly runnable in Google Colab, VSCode, and JupyterLab.',
      icon: BookOpen,
    },
    {
      id: 'huggingface',
      nameAr: 'مجموعة بيانات Hugging Face (Dataset)',
      nameEn: 'Hugging Face Dataset (.json)',
      descAr: 'تنسيق قياسي لتدريب وتوليف النماذج مفتوحة المصدر.',
      descEn: 'Standard fine-tuning dialog structure.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'تصدير المشروع بتنسيق متوافق بين النماذج' : 'Universal Project Export'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'تصدير متوافق مع كافة المنصات والأدوات' : 'Compatible with all platforms and workflows'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Vercel Direct Deploy Banner */}
          <div 
            onClick={() => {
              setIsExportModalOpen(false);
              setIsVercelModalOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white cursor-pointer hover:border-indigo-400 transition group flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg width="16" height="16" viewBox="0 0 76 65" fill="none">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-white">
                    {language === 'ar' ? 'تشغيل ونشر الموقع مباشرة على Vercel' : 'Deploy directly to Vercel'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                    1-Click
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {language === 'ar'
                    ? 'مشروع مهيأ بالكامل بملف vercel.json والدوال الخادمة السحابية'
                    : 'Pre-configured with vercel.json and Serverless API functions'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition ps-2">
              <span>{language === 'ar' ? 'فتح الدليل' : 'Open'}</span>
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Format Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {formats.map(f => {
              const isSelected = format === f.id;
              const Icon = f.icon;
              return (
                <div
                  key={f.id}
                  onClick={() => setFormat(f.id as any)}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {language === 'ar' ? f.nameAr : f.nameEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {language === 'ar' ? f.descAr : f.descEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Export Code Preview */}
          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1.5">
              {language === 'ar' ? 'معاينة مخرجات التصدير:' : 'Export Preview:'}
            </label>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
              <pre>{content.slice(0, 1200)}...</pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'ar' ? 'تم النسخ للحافظة' : 'Copied') : (language === 'ar' ? 'نسخ النص' : 'Copy')}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'ar' ? 'تنزيل الملف' : 'Download File'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
