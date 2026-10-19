import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Play, 
  Code2, 
  Cpu, 
  Eye, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare,
  Zap,
  Split,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SwarmAgent } from '../../types';

export const ModelSwarmView: React.FC = () => {
  const { 
    language, 
    swarmAgents, 
    swarmMessages, 
    isSwarmRunning, 
    runSwarmCollaboration, 
    toggleSwarmAgent,
    setActiveTab,
    selectedApp,
    models
  } = useApp();

  const [swarmPrompt, setSwarmPrompt] = useState('');
  const [arenaMode, setArenaMode] = useState(false);
  const [arenaModelA, setArenaModelA] = useState('deepseek-r1');
  const [arenaModelB, setArenaModelB] = useState('qwen-2.5-coder');
  const [arenaPrompt, setArenaPrompt] = useState('اكتب كود دالة لحساب أقصر مسار وخوارزمية التزامن بين النماذج');
  const [arenaResponses, setArenaResponses] = useState<{ a: string; b: string } | null>(null);
  const [isArenaRunning, setIsArenaRunning] = useState(false);

  const handleLaunchSwarm = () => {
    if (!swarmPrompt.trim() || isSwarmRunning) return;
    runSwarmCollaboration(swarmPrompt);
    setSwarmPrompt('');
  };

  const handleRunArena = async () => {
    if (!arenaPrompt.trim() || isArenaRunning) return;
    setIsArenaRunning(true);

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/models/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelId: arenaModelA, prompt: arenaPrompt }),
        }).then(r => r.json()),
        fetch('/api/models/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelId: arenaModelB, prompt: arenaPrompt }),
        }).then(r => r.json()),
      ]);

      setArenaResponses({
        a: resA.text || 'مخرجات النموذج الأول',
        b: resB.text || 'مخرجات النموذج الثاني',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsArenaRunning(false);
    }
  };

  const swarmPresetIdeas = [
    { ar: 'ابنِ تطبيق حاسبة استثمار ومخطط مالي تفاعلي بالرسوم البيانية', en: 'Build interactive ROI finance calculator with live charts' },
    { ar: 'ابنِ تطبيق منظم أوقات العمل وتقنية بومودورو مع مؤثرات صوتية', en: 'Build interactive Pomodoro productivity timer with sounds' },
    { ar: 'ابنِ لوحة تحكم ذكية لمراقبة استهلاك الطاقة وتوليد تقارير', en: 'Build smart energy IoT dashboard with real-time stats' },
    { ar: 'ابنِ لعبة ذاكرة وتطابق بطاقات كلاسيكية مع مستويات صعوبة', en: 'Build classic memory card matching game with score' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-xl border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'غرفة تعاون وتناغم النماذج الذكية (AI Model Swarm)' : 'Collaborative AI Swarm & Ensemble'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {language === 'ar' ? 'عمل النماذج مع بعضها بشكل كامل' : 'All Models Collaborating Together'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'فريق متكامل من نماذج الذكاء الاصطناعي يعمل معاً في آن واحد: DeepSeek للمعمارية، Qwen للبرمجة، FLUX للتصميم، و Gemini للتدقيق البرمجي، لإنتاج تطبيقات حقيقية متكاملة.'
              : 'Models work together as a co-development team in synchronized rounds: Architect, Designer, Lead Dev, and QA.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setArenaMode(!arenaMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              arenaMode 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>{language === 'ar' ? 'حلبة المقارنة المتزامنة (Arena)' : 'Split Arena'}</span>
          </button>
        </div>
      </div>

      {/* Swarm Agents Active Ensemble Bar */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>{language === 'ar' ? 'أعضاء فريق النماذج التعاوني النشط:' : 'Active Swarm Team Ensemble:'}</span>
          </span>
          <span className="text-slate-400">
            {swarmAgents.filter(a => a.isActive).length} {language === 'ar' ? 'نماذج نشطة' : 'models active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {swarmAgents.map(agent => (
            <div
              key={agent.id}
              onClick={() => toggleSwarmAgent(agent.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                agent.isActive
                  ? 'border-purple-500 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-purple-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${agent.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                  {agent.role === 'architect' ? <Cpu className="w-4 h-4" /> :
                   agent.role === 'developer' ? <Code2 className="w-4 h-4" /> :
                   agent.role === 'designer' ? <Eye className="w-4 h-4" /> :
                   agent.role === 'reviewer' ? <Sparkles className="w-4 h-4" /> :
                   <ShieldCheck className="w-4 h-4" />}
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${agent.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {agent.titleAr.split('(')[0]}
              </h5>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold mt-0.5">
                {agent.modelId}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Arena Mode View if toggled */}
      {arenaMode ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Split className="w-5 h-5 text-cyan-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'حلبة المقارنة والتوليد المتزامن (Split-Screen Arena)' : 'Multi-Model Concurrent Arena'}
              </h3>
            </div>
            <span className="text-xs text-slate-400">{language === 'ar' ? 'تشغيل نموذجين في نفس اللحظة' : 'Run 2 models concurrently'}</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={arenaPrompt}
              onChange={(e) => setArenaPrompt(e.target.value)}
              placeholder="اكتب التحدي أو المطلب للمقارنة المتزامنة بين النموذجين..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleRunArena}
              disabled={isArenaRunning || !arenaPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Zap className={`w-3.5 h-3.5 ${isArenaRunning ? 'animate-spin' : ''}`} />
              <span>{isArenaRunning ? (language === 'ar' ? 'جاري التوليد...' : 'Running...') : (language === 'ar' ? 'بدء المقارنة' : 'Run Arena')}</span>
            </button>
          </div>

          {/* Side by side outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Model A */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>النموذج أ: {arenaModelA}</span>
                <select
                  value={arenaModelA}
                  onChange={(e) => setArenaModelA(e.target.value)}
                  className="bg-transparent border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-[11px]"
                >
                  {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex-1 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {arenaResponses ? arenaResponses.a : (language === 'ar' ? 'في انتظار تشغيل الحلبة...' : 'Awaiting arena run...')}
              </div>
            </div>

            {/* Model B */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                <span>النموذج ب: {arenaModelB}</span>
                <select
                  value={arenaModelB}
                  onChange={(e) => setArenaModelB(e.target.value)}
                  className="bg-transparent border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-[11px]"
                >
                  {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex-1 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {arenaResponses ? arenaResponses.b : (language === 'ar' ? 'في انتظار تشغيل الحلبة...' : 'Awaiting arena run...')}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Standard Swarm Collaborative Session View */
        <div className="space-y-4">
          
          {/* Swarm Prompt Input Box */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{language === 'ar' ? 'توجيه الفريق التعاوني لبناء وتطوير تطبيق جديد:' : 'Task Multi-Model Team to Build App:'}</span>
            </h4>

            {/* Quick ideas chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {swarmPresetIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => setSwarmPrompt(language === 'ar' ? idea.ar : idea.en)}
                  className="px-3 py-1 rounded-xl text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0 transition"
                >
                  {language === 'ar' ? idea.ar : idea.en}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={swarmPrompt}
                onChange={(e) => setSwarmPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLaunchSwarm()}
                placeholder={
                  language === 'ar'
                    ? 'صف التطبيق أو البرنامج المطلوب وسيقوم الفريق بتقسيم المهام والبرمجة معاً...'
                    : 'Describe the application and the swarm will architect, design, code, and test together...'
                }
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500"
              />

              <button
                onClick={handleLaunchSwarm}
                disabled={!swarmPrompt.trim() || isSwarmRunning}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                <Play className={`w-4 h-4 fill-current ${isSwarmRunning ? 'animate-spin' : ''}`} />
                <span>{isSwarmRunning ? (language === 'ar' ? 'الفريق يعمل معاً...' : 'Team Collaborating...') : (language === 'ar' ? 'تشغيل الفريق التعاوني' : 'Deploy Swarm')}</span>
              </button>
            </div>
          </div>

          {/* Collaborative Live Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>{language === 'ar' ? 'سجل الحوار والتطوير التعاوني بين النماذج:' : 'Collaborative Co-Development Log:'}</span>
              <button
                onClick={() => setActiveTab('builder')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>{language === 'ar' ? 'عرض التطبيقات في المعاينة الحية' : 'View in Live Sandbox'}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>

            <div className="space-y-3">
              {swarmMessages.map((msg, idx) => {
                const agent = swarmAgents.find(a => a.id === msg.agentId);
                return (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${agent?.avatarColor || 'from-indigo-600 to-cyan-500'} text-white flex items-center justify-center font-bold text-xs`}>
                          #{msg.roundNumber}
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white">
                            {language === 'ar' ? msg.agentTitleAr : msg.agentTitleEn}
                          </span>
                          <span className="ms-2 text-[10px] text-slate-400 font-mono">
                            ({msg.modelId})
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>

                    {msg.codeSnippet && (
                      <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400">
                        {msg.codeSnippet}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
