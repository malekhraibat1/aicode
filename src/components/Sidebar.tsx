import React from 'react';
import { 
  Cpu, 
  GitBranch, 
  Layers, 
  FolderGit2, 
  Share2, 
  Workflow, 
  BarChart3, 
  ShieldCheck, 
  Cloud, 
  Sliders, 
  Compass, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    language, 
    activeTab, 
    setActiveTab, 
    commits, 
    assets, 
    workflows, 
    messages,
    selectedModel,
    setIsQuickTourOpen,
    setIsVercelModalOpen,
    generatedApps
  } = useApp();

  const navItems = [
    {
      id: 'studio',
      labelAr: 'الاستوديو الموحد',
      labelEn: 'Unified Studio',
      icon: Cpu,
      badge: 'الرئيسي',
      badgeEn: 'Core',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
    },
    {
      id: 'builder',
      labelAr: 'بناء ومعاينة التطبيقات والمكونات',
      labelEn: 'App Sandbox & Components',
      icon: Layers,
      badge: `${generatedApps.length} تطبيقات`,
      badgeEn: `${generatedApps.length} Apps`,
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'tools',
      labelAr: 'دليل أدوات تولزي والذكاء المجانية',
      labelEn: 'Tolzy AI Tools Hub',
      icon: Compass,
      badge: '+40 أداة',
      badgeEn: '40+ Tools',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'swarm',
      labelAr: 'تعاون النماذج الشامل',
      labelEn: 'Multi-Model Swarm',
      icon: Sparkles,
      badge: 'فريق متكامل',
      badgeEn: 'Full Swarm',
      badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'handoff',
      labelAr: 'ترحيل سياق العمل',
      labelEn: 'Cross-Model Hand-off',
      icon: Share2,
      badge: 'فوري',
      badgeEn: 'Instant',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300',
    },
    {
      id: 'versions',
      labelAr: 'سجل الإصدارات والفروقات',
      labelEn: 'VCS & Diff Viewer',
      icon: GitBranch,
      badge: `${commits.length}`,
      badgeEn: `${commits.length}`,
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'library',
      labelAr: 'المكتبة السحابية والموارد',
      labelEn: 'Shared Asset Library',
      icon: FolderGit2,
      badge: `${assets.length}`,
      badgeEn: `${assets.length}`,
      badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300',
    },
    {
      id: 'workflows',
      labelAr: 'تدفقات العمل وواجهة API',
      labelEn: 'Workflows & Open API',
      icon: Workflow,
      badge: `${workflows.length}`,
      badgeEn: `${workflows.length}`,
      badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'analytics',
      labelAr: 'التحليلات ومصفوفة الأداء',
      labelEn: 'Analytics & Benchmarks',
      icon: BarChart3,
      badge: 'KPIs',
      badgeEn: 'KPIs',
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
    },
    {
      id: 'settings',
      labelAr: 'الأمان والتخزين السحابي',
      labelEn: 'Security & Cloud Sync',
      icon: ShieldCheck,
      badge: 'AES-256',
      badgeEn: 'AES-256',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',
    },
  ];

  const totalTokens = messages.reduce((acc, m) => acc + (m.tokens || 0), 0);

  return (
    <aside className="w-64 lg:w-72 shrink-0 border-e border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 flex flex-col justify-between hidden md:flex">
      
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {language === 'ar' ? 'أقسام المنصة' : 'Platform Modules'}
            </span>
            <button
              onClick={() => setIsQuickTourOpen(true)}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              <span>{language === 'ar' ? 'جولة سريعة' : 'Quick Tour'}</span>
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`} />
                    <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {language === 'ar' ? item.badge : item.badgeEn}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Handoff Helper Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200/50 dark:border-indigo-800/40">
          <div className="flex items-center gap-2 mb-1.5 text-indigo-700 dark:text-indigo-300">
            <Zap className="w-4 h-4" />
            <h5 className="text-xs font-bold">
              {language === 'ar' ? 'الترحيل التلقائي الذكي' : 'Auto Handoff Engine'}
            </h5>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'ar' 
              ? 'واصل العمل من أي نموذج إلى آخر دون تكرار الأوامر وبحفظ كامل للسياق.'
              : 'Pick up any generated output with another model instantly without losing context.'}
          </p>
        </div>
      </div>

      {/* Workspace Health & Telemetry Pill */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <span>{language === 'ar' ? 'الرموز المعالجة' : 'Tokens Used'}</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {totalTokens.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <span>{language === 'ar' ? 'سرعة الاستجابة' : 'Avg Latency'}</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            ~410ms
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <span>{language === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost'}</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            $0.00 ({language === 'ar' ? '100% مجاني' : '100% Free'})
          </span>
        </div>

        {/* Vercel Deploy Trigger in Sidebar */}
        <button
          onClick={() => setIsVercelModalOpen(true)}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition hover:scale-[1.02]"
        >
          <svg width="12" height="12" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span>{language === 'ar' ? '🚀 تشغيل على Vercel' : '🚀 Deploy on Vercel'}</span>
        </button>
      </div>

    </aside>
  );
};
