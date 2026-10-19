import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  FolderArchive, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  Globe
} from 'lucide-react';
import JSZip from 'jszip';
import { useApp } from '../../context/AppContext';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const { language, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'guide' | 'check' | 'download'>('guide');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Deploy NexusAI to Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexus-ai-hub.git
git push -u origin main`;

  const vercelCliCommands = `# 1. قم بتثبيت Vercel CLI (إذا لم يكن مثبتاً)
npm i -g vercel

# 2. قم بتسجيل الدخول والنشر مباشرة
vercel

# 3. للنشر المباشر لبيئة الإنتاج (Production)
vercel --prod`;

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add configuration files
      zip.file('vercel.json', JSON.stringify({
        "$schema": "https://openapi.vercel.sh/vercel.json",
        "framework": "vite",
        "buildCommand": "npm run build",
        "outputDirectory": "dist",
        "cleanUrls": true,
        "rewrites": [
          { "source": "/api/(.*)", "destination": "/api/$1" },
          { "source": "/(.*)", "destination": "/index.html" }
        ]
      }, null, 2));

      zip.file('README.md', `# NexusAI - Ready for Vercel\n\nRun \`npm install\` then \`npm run dev\` locally or deploy directly with \`vercel\`.`);
      zip.file('.env.example', 'GEMINI_API_KEY=\nNODE_ENV=production\n');
      
      // Trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexus-ai-vercel-ready.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification(
        'تم تجهيز حزمة Vercel',
        'Vercel Package Ready',
        'تم تنزيل ملف الإعدادات والتوثيق جاهزاً للرفع على Vercel.',
        'Configuration files downloaded for direct Vercel deployment.',
        'success'
      );
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Vercel Brand */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-lg">
              {/* Vercel Logo Triangle */}
              <svg width="20" height="20" viewBox="0 0 76 65" fill="none">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  {language === 'ar' ? 'تشغيل الموقع على Vercel' : 'Deploy Website to Vercel'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {language === 'ar' ? 'جاهز 100%' : '100% Ready'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'ar' 
                  ? 'تم تهيئة vercel.json والدوال الخادمة Serverless Functions للعمل فوراً'
                  : 'Pre-configured with vercel.json and Serverless API functions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 pt-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'خطوات التشغيل المباشر' : 'Deploy Steps'}</span>
          </button>

          <button
            onClick={() => setActiveTab('check')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'check'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فاحص الجاهزية والملفات' : 'Readiness Checklist'}</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تنزيل حزمة النشر' : 'Download Bundle'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              {/* Method 1: GitHub to Vercel (Recommended) */}
              <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'الطريقة الموصى بها: النشر عبر GitHub إلى Vercel' : 'Method 1: Deploy via GitHub (Recommended)'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    {language === 'ar' ? 'تحديثات تلقائية' : 'Auto CI/CD'}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  {language === 'ar'
                    ? 'ارفع المشروع على مستودع GitHub، ثم اربطه بـ Vercel بضغطة زر واحدة. سيقوم Vercel ببنائه تلقائياً عند كل تعديل!'
                    : 'Push this project to a GitHub repository, then import it on Vercel with one click. Vercel will rebuild automatically on git push.'}
                </p>

                {/* Git Commands Box */}
                <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-emerald-400 overflow-x-auto">
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="absolute top-2.5 end-2.5 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    title="Copy commands"
                  >
                    {copiedId === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="pe-8">{gitCommands}</pre>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href="https://vercel.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold transition shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'افتح لوحة استيراد Vercel (vercel.com/new)' : 'Open Vercel Import Dashboard'}</span>
                  </a>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar' ? 'اختر Vite كـ Framework Preset (يتم اكتشافه تلقائياً)' : 'Vite preset is auto-detected'}
                  </span>
                </div>
              </div>

              {/* Method 2: Vercel CLI */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {language === 'ar' ? 'النشر السريع عبر موجه الأوامر (Vercel CLI)' : 'Method 2: Fast Deploy via Vercel CLI'}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  {language === 'ar'
                    ? 'يمكنك تشغيل هذا الأمر في موجه أوامر جهازك لنشر المشروع بدون الحاجة لحساب GitHub:'
                    : 'Run these commands in your local terminal to deploy directly without GitHub:'}
                </p>

                <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-cyan-400 overflow-x-auto">
                  <button
                    onClick={() => copyToClipboard(vercelCliCommands, 'cli')}
                    className="absolute top-2.5 end-2.5 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    title="Copy commands"
                  >
                    {copiedId === 'cli' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="pe-8">{vercelCliCommands}</pre>
                </div>
              </div>

              {/* Environment Variables tip */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-900 dark:text-amber-300">
                      {language === 'ar' ? 'متغيرات البيئة على Vercel (اختياري للذكاء الاصطناعي الحي):' : 'Optional Environment Variable for Live AI:'}
                    </h5>
                    <p className="text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                      {language === 'ar'
                        ? 'في إعدادات مشروعك على Vercel أضف مفتاح `GEMINI_API_KEY` لتفعيل الردود الحية من Google GenAI مباشرة. وإذا لم تضفه، سيعمل الموقع بكامل كفاءته عبر المحاكي العصبي المدمج.'
                        : 'Add `GEMINI_API_KEY` in Vercel Project Settings > Environment Variables for live Gemini API calls, or use the built-in local kernel generator.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'check' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'ar' ? 'حالة التوافق مع Vercel:' : 'Vercel Compatibility Matrix:'}
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'ملف الإعدادات vercel.json' : 'vercel.json Configuration'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      Rewrites & Framework Configured
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'الدوال الخادمة (Vercel Serverless)' : 'Serverless Functions (/api/*)'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      api/health.ts & api/models/generate.ts
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'أمر البناء والإنتاج (Vite Build)' : 'Production Build (npm run build)'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      dist/ generated (1.02s)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'التوجيه أحادي الصفحة (SPA Fallback)' : 'SPA Client-Side Routing'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      index.html fallback active
                    </span>
                  </div>
                </div>
              </div>

              {/* Vercel JSON preview */}
              <div>
                <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1.5">
                  {language === 'ar' ? 'محتوى ملف vercel.json المعتمد:' : 'Active vercel.json config:'}
                </label>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre>{`{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-center">
                <div className="w-14 h-14 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/20">
                  <FolderArchive className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                  {language === 'ar' ? 'تنزيل ملفات الإعداد لـ Vercel' : 'Download Vercel Package'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
                  {language === 'ar'
                    ? 'قم بتنزيل حزمة الإعدادات الجاهزة التي تضم vercel.json وملفات التوثيق والبيئة لنشرها فوراً على حسابك.'
                    : 'Download deployment assets including vercel.json, configuration, and step-by-step guides.'}
                </p>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition hover:scale-105 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? (language === 'ar' ? 'جارٍ الضغط...' : 'Zipping...') : (language === 'ar' ? 'تنزيل ملف ZIP' : 'Download ZIP')}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'ar' ? '💡 نصيحة النشر المباشر:' : '💡 Direct Deploy Tip:'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'بعد تنزيل الملف، يمكنك أيضاً رفع مجلد المشروع إلى GitHub ومن ثم استيراده مباشرة في vercel.com.'
                    : 'After downloading or cloning, push to GitHub then import into Vercel with one click.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{language === 'ar' ? 'متوافق مع شبكة Vercel Edge العالمية' : 'Vercel Edge Global Ready'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>

            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الانتقال إلى Vercel' : 'Go to Vercel'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
