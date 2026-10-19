import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  RotateCcw, 
  Plus, 
  FileDiff, 
  Clock, 
  User, 
  Check, 
  Cpu, 
  ArrowRight, 
  ShieldCheck,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VersionCommit } from '../../types';

export const VersionHistory: React.FC = () => {
  const { 
    language, 
    commits, 
    createCommit, 
    restoreCommit, 
    messages, 
    selectedModel,
    selectedDiffCommit,
    setSelectedDiffCommit,
    setActiveTab,
  } = useApp();

  const [newCommitMessage, setNewCommitMessage] = useState('');
  const [newCommitTag, setNewCommitTag] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeCompareCommit, setActiveCompareCommit] = useState<VersionCommit | null>(commits[0] || null);

  const handleCreate = () => {
    if (!newCommitMessage.trim()) return;
    createCommit(newCommitMessage, newCommitTag || undefined);
    setNewCommitMessage('');
    setNewCommitTag('');
    setIsCreating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'نظام إدارة الإصدارات المركزي (VCS)' : 'Centralized Version Control'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? 'تتبع كافة التعديلات، وعمليات الترحيل بين النماذج، مع إمكانية المقارنة والاسترجاع الفوري لأي نقطة حفظ.'
              : 'Track modifications, diff changes between models, and restore previous snapshots with 1-click rollback.'}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إنشاء نقطة حفظ (Commit)' : 'New Version Point'}</span>
        </button>
      </div>

      {/* New Commit Drawer */}
      {isCreating && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 animate-in fade-in duration-150">
          <h4 className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'ar' ? 'تسجيل إصدار جديد في السجل المركزي' : 'Commit Current Workspace State'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'ar' ? 'رسالة الإصدار (Commit Message):' : 'Commit Message:'}
              </label>
              <input
                type="text"
                value={newCommitMessage}
                onChange={(e) => setNewCommitMessage(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: تعديل كود التزامن اللحظي وترحيله لـ Qwen' : 'e.g. Added handoff router logic'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'ar' ? 'وسم الإصدار (Tag):' : 'Version Tag:'}
              </label>
              <input
                type="text"
                value={newCommitTag}
                onChange={(e) => setNewCommitTag(e.target.value)}
                placeholder="v1.2-feature"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleCreate}
              disabled={!newCommitMessage.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs disabled:opacity-50"
            >
              {language === 'ar' ? 'تأكيد الحفظ' : 'Confirm Commit'}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Commits List & Visual Diff Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Commits Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
            <span>{language === 'ar' ? 'شجرة الإصدارات والنقاط الزمنية' : 'Version Commit Tree'}</span>
            <span className="font-mono">{commits.length} {language === 'ar' ? 'إصدار' : 'commits'}</span>
          </div>

          <div className="space-y-3">
            {commits.map((c, idx) => {
              const isSelectedForDiff = activeCompareCommit?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelectedForDiff
                      ? 'border-indigo-600 bg-indigo-50/40 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 font-mono text-xs font-bold">
                        #{commits.length - idx}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {c.message}
                          </span>
                          {c.tag && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {c.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(c.timestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Cpu className="w-3 h-3 text-indigo-500" />
                            {c.modelId}
                          </span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            +{c.diffSummary.additions}
                          </span>
                          {c.diffSummary.deletions > 0 && (
                            <span className="font-mono text-rose-500 font-bold">
                              -{c.diffSummary.deletions}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions for this commit */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setActiveCompareCommit(c)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          isSelectedForDiff
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {language === 'ar' ? 'مقارنة الفروقات' : 'Inspect Diff'}
                      </button>

                      <button
                        onClick={() => restoreCommit(c.id)}
                        title={language === 'ar' ? 'استرجاع هذه النسخة لمساحة العمل' : 'Restore snapshot'}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Diff Viewer Panel (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileDiff className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {language === 'ar' ? 'مستعرض الفروقات (Diff Inspector)' : 'Visual Diff Inspector'}
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {activeCompareCommit?.tag || activeCompareCommit?.id || 'HEAD'}
              </span>
            </div>

            {activeCompareCommit ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'تفاصيل الإصدار المحدد:' : 'Selected Snapshot Details:'}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{activeCompareCommit.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                    <span>{activeCompareCommit.snapshotMessages.length} {language === 'ar' ? 'رسائل محفوظة' : 'messages saved'}</span>
                    <span>•</span>
                    <span>{new Date(activeCompareCommit.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Diff Line View */}
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    {language === 'ar' ? 'سجل التغييرات المضافة والمعدلة:' : 'Highlighted Line Diffs:'}
                  </span>

                  <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1 max-h-72 overflow-y-auto leading-relaxed">
                    <div className="text-slate-500 font-semibold mb-2">
                      @@ -1,4 +1,7 @@ {activeCompareCommit.id} ({activeCompareCommit.modelId})
                    </div>
                    <div className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded">
                      + [Handoff] Source: {activeCompareCommit.modelId}
                    </div>
                    <div className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded">
                      + dispatchHandoff(contextBuffer, objective);
                    </div>
                    <div className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded">
                      + synchronizeState(liveQueue, encryptedVault);
                    </div>
                    <div className="text-rose-400 bg-rose-950/40 px-1 py-0.5 rounded">
                      - legacyIsolatedModelSession();
                    </div>
                    <div className="text-slate-400 px-1">
                      &nbsp;&nbsp;return unifiedAICoreInstance;
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => restoreCommit(activeCompareCommit.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'ar' ? 'استرجاع هذا الإصدار الآن' : 'Rollback to this Version'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">
                {language === 'ar' ? 'اختر إصداراً لمعاينة الفروقات' : 'Select a commit to view diff'}
              </p>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
