import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  Plus, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Zap,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkflowBuilder: React.FC = () => {
  const { language, workflows, runWorkflow, isWorkflowRunning, models } = useApp();

  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [activeApiTab, setActiveApiTab] = useState<'curl' | 'python' | 'ts'>('curl');
  const [copiedApi, setCopiedApi] = useState(false);

  const selectedWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  const handleCopyApi = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  const curlCode = `curl -X POST "https://api.nexus-ai.studio/v1/workflow/run" \\
  -H "Authorization: Bearer nx_live_sec_token_9435748" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflowId": "${selectedWorkflow?.id || 'wf-1'}",
    "inputPrompt": "حلل معمارية النظام الموحد وولد الكود التنفيذي",
    "handoffChain": ["deepseek-r1", "qwen-2.5-coder", "gemini-3.8-flash"],
    "callbackWebhook": "https://myapp.com/api/webhooks/nexus-ai"
  }'`;

  const pythonCode = `import requests

API_URL = "https://api.nexus-ai.studio/v1/workflow/run"
HEADERS = {
    "Authorization": "Bearer nx_live_sec_token_9435748",
    "Content-Type": "application/json"
}

payload = {
    "workflowId": "${selectedWorkflow?.id || 'wf-1'}",
    "inputPrompt": "حلل معمارية النظام الموحد وولد الكود التنفيذي",
    "callbackWebhook": "https://myapp.com/api/webhooks/nexus-ai"
}

response = requests.post(API_URL, json=payload, headers=HEADERS)
data = response.json()
print("Workflow Execution Result:", data["result"])`;

  const tsCode = `import axios from 'axios';

async function triggerNexusWorkflow() {
  const res = await axios.post('https://api.nexus-ai.studio/v1/workflow/run', {
    workflowId: '${selectedWorkflow?.id || 'wf-1'}',
    inputPrompt: 'حلل معمارية النظام الموحد وولد الكود التنفيذي',
    callbackWebhook: 'https://myapp.com/api/webhooks/nexus-ai'
  }, {
    headers: { Authorization: 'Bearer nx_live_sec_token_9435748' }
  });

  console.log('Result:', res.data);
}`;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'تدفقات العمل المخصصة وواجهة البرمجة (Open API)' : 'Custom Workflows & Open API'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? 'بناء سلاسل تنفيذ آلية تربط عدة نماذج ببعضها البعض، مع توفير واجهة برمجية مفتوحة لدمج الإضافات الخارجية.'
              : 'Construct automated multi-model pipelines and integrate external extensions via Open REST API.'}
          </p>
        </div>

        <button
          onClick={() => selectedWorkflow && runWorkflow(selectedWorkflow.id)}
          disabled={isWorkflowRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all shrink-0 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isWorkflowRunning ? 'animate-spin' : ''}`} />
          <span>
            {isWorkflowRunning 
              ? (language === 'ar' ? 'جارٍ تنفيذ التدفق...' : 'Running Pipeline...') 
              : (language === 'ar' ? 'تشغيل هذا التدفق الآن' : 'Run Pipeline Now')}
          </span>
        </button>
      </div>

      {/* Select Workflow Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => setActiveWorkflowId(wf.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeWorkflowId === wf.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{wf.name}</span>
          </button>
        ))}
      </div>

      {/* Selected Workflow Visual Pipeline */}
      {selectedWorkflow && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {selectedWorkflow.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedWorkflow.description}
              </p>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'آخر تشغيل' : 'Last Run'}</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{selectedWorkflow.lastRun || 'الآن'}</span>
            </div>
          </div>

          {/* Sequential Step Nodes */}
          <div className="space-y-4">
            {selectedWorkflow.steps.map((step, idx) => {
              const modelObj = models.find(m => m.id === step.modelId);
              return (
                <div key={step.id} className="relative">
                  <div className={`p-4 rounded-2xl border transition-all ${
                    step.status === 'running'
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-500/20'
                      : step.status === 'completed'
                      ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          step.status === 'completed' 
                            ? 'bg-emerald-600 text-white' 
                            : step.status === 'running'
                            ? 'bg-purple-600 text-white animate-spin'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {step.status === 'completed' ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {step.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {language === 'ar' ? 'النموذج المكلف:' : 'Assigned Model:'} <strong className="text-indigo-600 dark:text-indigo-400">{modelObj?.name || step.modelId}</strong>
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        step.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : step.status === 'running'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {step.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                         step.status === 'running' ? (language === 'ar' ? 'جارٍ المعالجة...' : 'Processing...') :
                         (language === 'ar' ? 'في الانتظار' : 'Pending')}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-xs font-mono text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400 font-sans block text-[10px] mb-0.5">{language === 'ar' ? 'قالب التوجيه البرمجي:' : 'Prompt Directive:'}</span>
                      {step.promptTemplate}
                    </div>

                    {step.outputResult && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
                        <span className="font-bold block text-[10px] mb-0.5">{language === 'ar' ? 'المخرجات المولدة بنجاح:' : 'Generated Step Output:'}</span>
                        {step.outputResult}
                      </div>
                    )}
                  </div>

                  {/* Arrow connector between steps */}
                  {idx < selectedWorkflow.steps.length - 1 && (
                    <div className="w-0.5 h-4 bg-indigo-300 dark:bg-indigo-800 mx-auto my-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Open API & Plugin Integration Docs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'واجهة برمجة التطبيقات المفتوحة (Open REST API & Webhooks)' : 'Open API & Webhooks'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar'
                ? 'اربط تدفقات العمل المخصصة بتطبيقاتك ومواقعك الخارجية بسهولة عبر استدعاءات REST.'
                : 'Trigger multi-model workflows and hand-offs from external apps and services via REST.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveApiTab('curl')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                activeApiTab === 'curl' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveApiTab('python')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                activeApiTab === 'python' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveApiTab('ts')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                activeApiTab === 'ts' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              TypeScript
            </button>
          </div>
        </div>

        {/* Code Snippet Box with 1-click Copy */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
          <button
            onClick={() => handleCopyApi(activeApiTab === 'curl' ? curlCode : activeApiTab === 'python' ? pythonCode : tsCode)}
            className="absolute top-3 end-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px]"
          >
            {copiedApi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedApi ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
          </button>

          <pre className="pe-16 leading-relaxed">
            {activeApiTab === 'curl' ? curlCode : activeApiTab === 'python' ? pythonCode : tsCode}
          </pre>
        </div>
      </div>

    </div>
  );
};
