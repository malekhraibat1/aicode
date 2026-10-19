import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  Eye, 
  Cpu, 
  Zap, 
  Share2, 
  GitBranch, 
  ArrowRight, 
  Layers, 
  History,
  Check,
  TrendingUp,
  FileCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HandoffGoal } from '../../types';

export const HandoffHubView: React.FC = () => {
  const { language, models, messages, openHandoffModal, executeHandoff, setActiveTab } = useApp();

  const [sourceModelId, setSourceModelId] = useState('deepseek-r1');
  const [targetModelId, setTargetModelId] = useState('qwen-2.5-coder');
  const [selectedGoal, setSelectedGoal] = useState<HandoffGoal>('code');
  const [customPrompt, setCustomPrompt] = useState('استخرج المخطط المعماري وحوله لكود برمجي عالي الكفاءة مع اختبارات الوحدة.');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter messages that have handoffs
  const handoffHistory = messages.filter(m => m.handoffTrace);

  const pipelines = [
    {
      titleAr: 'سلسلة الهندسة والبرمجة (Architecture ➔ Code)',
      titleEn: 'Engineering Pipeline (Architecture ➔ Code)',
      source: 'DeepSeek-R1',
      target: 'Qwen 2.5 Coder',
      goal: 'code' as HandoffGoal,
      descAr: 'استخدام الاستدلال العميق لـ DeepSeek لصياغة الخوارزمية، ثم ترحيلها إلى Qwen لكتابة الكود واختبارات الوحدة.',
      descEn: 'Leverage DeepSeek logic to formulate algorithm, then hand off to Qwen for clean implementation.',
      badgeAr: 'الأكثر كفاءة برمجياً',
      badgeEn: 'Best for Software',
    },
    {
      titleAr: 'سلسلة الإبداع والتصور البصري (Concept ➔ 3D Render)',
      titleEn: 'Creative Synthesis (Concept ➔ 3D Render)',
      source: 'Gemini 3.8 Flash',
      target: 'FLUX.1 Schnell',
      goal: 'visualize' as HandoffGoal,
      descAr: 'صياغة فكرة التصميم وسيناريو المشهد ثم ترحيله مباشرة إلى محرك الصور FLUX لتوليد لقطة واقعية بدقة 8k.',
      descEn: 'Draft scene concept and camera direction, then hand off to FLUX for high-res photorealistic rendering.',
      badgeAr: 'توليد بصري فوري',
      badgeEn: 'Instant Visual Synthesis',
    },
    {
      titleAr: 'سلسلة التدقيق الأمني والتحسين (Draft ➔ Security Audit)',
      titleEn: 'Security & Quality Audit (Draft ➔ Security Audit)',
      source: 'Meta Llama 3.3',
      target: 'DeepSeek-R1',
      goal: 'critique' as HandoffGoal,
      descAr: 'فحص مخرجات المسودة بحثاً عن أي ثغرات منطقية أو أمنية وتقديم براهين التحقق.',
      descEn: 'Audit draft outputs for logical flaws, performance bottlenecks, and security gaps.',
      badgeAr: 'تدقيق صارم',
      badgeEn: 'Rigorous Verification',
    },
  ];

  const handleLaunchPipeline = async (p: typeof pipelines[0]) => {
    setIsProcessing(true);
    // Find model IDs
    const src = models.find(m => m.name.includes(p.source.split(' ')[0])) || models[0];
    const trg = models.find(m => m.name.includes(p.target.split(' ')[0])) || models[1];
    
    // Switch to studio and trigger
    await executeHandoff(trg.id, p.goal, p.titleAr);
    setIsProcessing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-cyan-300 border border-cyan-500/30 mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'محرك الترحيل المتعدد للنماذج' : 'Universal Model Hand-off Engine'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {language === 'ar' ? 'تابع العمل من مكان التوقف للنموذج الآخر' : 'Seamless Cross-Model Continuity'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'تتيح لك هذه المنصة نقل سياق الحوار والمخرجات والأكواد من أي نموذج مجاني إلى نموذج آخر بضغطة واحدة، دون إعادة كتابة، مع تزامن لحظي وسجل تتبع دقيق.'
              : 'Transfer dialogue context, active tokens, and intermediate code from any model to another in real time with complete state retention.'}
          </p>
        </div>
      </div>

      {/* Featured Automated Pipelines */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" />
            <span>{language === 'ar' ? 'سلاسل الترحيل الجاهزة الأكثر شيوعاً' : 'Recommended Pre-configured Pipelines'}</span>
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'ar' ? 'بنقرة واحدة للتشغيل الفوري' : '1-Click Launch'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pipelines.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {language === 'ar' ? p.badgeAr : p.badgeEn}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>{p.source}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-500 rtl:rotate-180" />
                    <span className="text-indigo-600 dark:text-indigo-400">{p.target}</span>
                  </div>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {language === 'ar' ? p.titleAr : p.titleEn}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {language === 'ar' ? p.descAr : p.descEn}
                </p>
              </div>

              <button
                onClick={() => handleLaunchPipeline(p)}
                disabled={isProcessing}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 dark:text-indigo-600" />
                <span>{language === 'ar' ? 'تشغيل مسار الترحيل' : 'Launch Hand-off Flow'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hand-off History & Trace Log */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'سجل عمليات الترحيل السابقة في هذا المشروع' : 'Session Hand-off Audit Trail'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {handoffHistory.length} {language === 'ar' ? 'عملية ترحيل' : 'transfers recorded'}
          </span>
        </div>

        {handoffHistory.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center bg-white/50 dark:bg-slate-900/50">
            <Share2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'لم تقم بأي عملية ترحيل بعد. اذهب إلى الاستوديو واضغط على "ترحيل إلى نموذج آخر" تحت أي رسالة.'
                : 'No hand-offs recorded yet. Go to the Studio and click "Hand off to Model" on any message.'}
            </p>
            <button
              onClick={() => setActiveTab('studio')}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs inline-block"
            >
              {language === 'ar' ? 'الذهاب للاستوديو' : 'Go to Studio'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {handoffHistory.map((m) => {
              const trace = m.handoffTrace!;
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {trace.sourceModel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-500 rtl:rotate-180" />
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                          {trace.targetModel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                          {language === 'ar' ? trace.goalLabelAr : trace.goalLabelEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(trace.timestamp).toLocaleString()} • {trace.transferredTokens} {language === 'ar' ? 'رمز منقول' : 'tokens transferred'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('studio')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 shrink-0"
                  >
                    {language === 'ar' ? 'عرض في الاستوديو' : 'View in Studio'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
