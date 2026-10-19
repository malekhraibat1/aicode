import React, { useState } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Sparkles, 
  Share2, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Eye, 
  Sliders, 
  FileText, 
  Cpu, 
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HandoffGoal } from '../../types';

export const HandoffModal: React.FC = () => {
  const { 
    language, 
    models, 
    activeHandoffPayload, 
    isHandoffModalOpen, 
    closeHandoffModal, 
    executeHandoff 
  } = useApp();

  const [selectedTargetId, setSelectedTargetId] = useState<string>('qwen-2.5-coder');
  const [selectedGoal, setSelectedGoal] = useState<HandoffGoal>('continue');
  const [customDirective, setCustomDirective] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isHandoffModalOpen || !activeHandoffPayload) return null;

  const sourceModelName = activeHandoffPayload.sourceModel;
  const targetModel = models.find(m => m.id === selectedTargetId) || models[0];

  const goals: { id: HandoffGoal; titleAr: string; titleEn: string; descAr: string; descEn: string; icon: any }[] = [
    {
      id: 'continue',
      titleAr: 'متابعة من مكان التوقف',
      titleEn: 'Continue from Stopping Point',
      descAr: 'مواصلة توليد المحتوى مباشرة من آخر فكرة أو سطر تم إنهاؤه.',
      descEn: 'Pick up output generation from the exact point the previous model ended.',
      icon: Zap,
    },
    {
      id: 'code',
      titleAr: 'تحويل إلى كود تنفيذي',
      titleEn: 'Transform to Executable Code',
      descAr: 'تحويل المخططات والتحليلات إلى كود برمجي متكامل ومختبر.',
      descEn: 'Convert conceptual design and logic directly into runnable code.',
      icon: Code2,
    },
    {
      id: 'refine',
      titleAr: 'تدقيق وتحسين الصياغة والأداء',
      titleEn: 'Refine & Polish',
      descAr: 'مراجعة المخرجات بحثاً عن تحسينات الأسلوب، الدقة، والكفاءة.',
      descEn: 'Review for style clarity, technical efficiency, and edge cases.',
      icon: CheckCircle2,
    },
    {
      id: 'visualize',
      titleAr: 'توليد تصور بصري (FLUX)',
      titleEn: 'Synthesize Visual Concept',
      descAr: 'استخلاص المشهد الفني وتحويل الفكرة إلى برومبت بصري لنموذج الصور.',
      descEn: 'Distill visual scene cues and generate high-fidelity art prompt.',
      icon: Eye,
    },
    {
      id: 'critique',
      titleAr: 'نقد تحليلي واكتشاف الثغرات',
      titleEn: 'Critical Review & Bug Audit',
      descAr: 'فحص المشاكل المحتملة، الثغرات الأمنية، والاختناقات.',
      descEn: 'Analyze potential security vulnerabilities and algorithmic bottlenecks.',
      icon: ShieldAlert,
    },
    {
      id: 'summarize',
      titleAr: 'تلخيص تنفيذي مركز',
      titleEn: 'Executive Summary',
      descAr: 'استخلاص خلاصة النتائج والتوصيات المباشرة في نقاط موجزة.',
      descEn: 'Distill comprehensive findings into crisp actionable bullets.',
      icon: FileText,
    },
  ];

  const handleStartHandoff = async () => {
    setIsExecuting(true);
    await executeHandoff(selectedTargetId, selectedGoal, customDirective);
    setIsExecuting(false);
  };

  const estimatedTokens = Math.round(activeHandoffPayload.output.length / 3.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'ترحيل سياق العمل بين النماذج' : 'Cross-Model Seamless Hand-off'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  {language === 'ar' ? 'تزامن لحظي' : 'Live State'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' 
                  ? 'متابعة العمل من مكان التوقف إلى نموذج تخصصي آخر مع احتفاظ تام بالذاكرة.'
                  : 'Transfer state and continue output generation with zero data loss.'}
              </p>
            </div>
          </div>

          <button
            onClick={closeHandoffModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Transfer Bridge Visualization Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-purple-500/10 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs">
                {sourceModelName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'نموذج البداية' : 'Source'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{sourceModelName}</span>
              </div>
            </div>

            <div className="flex flex-col items-center px-4">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold">
                <span>{estimatedTokens} tok</span>
                <ArrowRightLeft className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-400">{language === 'ar' ? 'ترحيل الذاكرة' : 'Memory Bridge'}</span>
            </div>

            <div className="flex items-center gap-2 text-end">
              <div>
                <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'النموذج الهدف' : 'Target'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{targetModel.name}</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30">
                {targetModel.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Source Payload Preview */}
          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1.5">
              {language === 'ar' ? 'محتوى سياق التوقف المنقول (Context Buffer):' : 'Captured Handoff Output Buffer:'}
            </label>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto leading-relaxed">
              {activeHandoffPayload.output.slice(0, 320)}...
            </div>
          </div>

          {/* Step 1: Select Target Model */}
          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-2">
              {language === 'ar' ? '1. اختر النموذج الهدف لمتابعة العمل:' : '1. Choose Destination Model:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {models.map(m => {
                const isSelected = selectedTargetId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedTargetId(m.id)}
                    className={`p-2.5 rounded-xl border text-start transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {m.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {m.provider}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Handoff Strategy & Goal */}
          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-2">
              {language === 'ar' ? '2. حدد الهدف واستراتيجية الترحيل:' : '2. Select Hand-off Objective:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goals.map(g => {
                const isSelected = selectedGoal === g.id;
                const Icon = g.icon;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-3 rounded-xl border text-start flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/70 dark:border-cyan-500 dark:bg-cyan-950/40 ring-1 ring-cyan-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {language === 'ar' ? g.titleAr : g.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {language === 'ar' ? g.descAr : g.descEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Optional Custom Directive */}
          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1.5">
              {language === 'ar' ? '3. توجيه إضافي مخصص للنموذج (اختياري):' : '3. Optional Specific Instruction:'}
            </label>
            <input
              type="text"
              value={customDirective}
              onChange={(e) => setCustomDirective(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'مثال: ركز على تقليل استهلاك الذاكرة وإضافة تعليقات توضيحية...'
                  : 'E.g. Focus on memory optimization and add unit tests...'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={closeHandoffModal}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleStartHandoff}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>
              {isExecuting 
                ? (language === 'ar' ? 'جاري ترحيل السياق ومتابعة التوليد...' : 'Transferring Context...') 
                : (language === 'ar' ? `ترحيل العمل إلى ${targetModel.name}` : `Hand off to ${targetModel.name}`)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
