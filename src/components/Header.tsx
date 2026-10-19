import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  Upload, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Headphones, 
  CheckCircle2, 
  Cloud,
  ChevronDown,
  Layers,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC<{ onOpenCloudModal: () => void }> = ({ onOpenCloudModal }) => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    isOffline, 
    toggleSimulatedOffline, 
    offlineQueueCount, 
    isSyncing, 
    syncOfflineChanges,
    mfaEnabled,
    encryptionActive,
    notifications,
    markNotificationRead,
    clearNotifications,
    setIsExportModalOpen,
    setIsVercelModalOpen,
    setIsSupportModalOpen,
    setIsQuickTourOpen,
    importProjectData,
    selectedModel,
    activeTab,
    setActiveTab,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importProjectData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-white/90 border-slate-200 dark:bg-slate-950/90 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        
        {/* Brand & Active Model Pill */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
                  NexusAI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Unified Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {language === 'ar' ? 'المنصة الموحدة لنماذج الذكاء الاصطناعي المجانية' : 'Unified Free AI Models & Hand-off Engine'}
              </p>
            </div>
          </div>

          {/* Active Model Indicator Tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {language === 'ar' ? 'النموذج النشط:' : 'Active:'} <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedModel.name}</strong>
            </span>
            {selectedModel.isLiveApi && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                Live API
              </span>
            )}
          </div>
        </div>

        {/* Global Action & Status Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Real-time Sync & Offline Mode Pill */}
          <div className="flex items-center">
            {isOffline ? (
              <button
                onClick={toggleSimulatedOffline}
                title={language === 'ar' ? 'أنت في وضع عدم الاتصال. انقر للتبديل' : 'Offline mode. Click to toggle'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{language === 'ar' ? 'أوفلاين' : 'Offline'}</span>
                {offlineQueueCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 dark:bg-amber-900 font-bold">
                    {offlineQueueCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={syncOfflineChanges}
                disabled={isSyncing}
                title={language === 'ar' ? 'متزامن لحظياً. انقر لإعادة الفحص' : 'Real-time synchronized. Click to recheck'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isSyncing 
                    ? (language === 'ar' ? 'جارٍ المزامنة...' : 'Syncing...') 
                    : (language === 'ar' ? 'تزامن لحظي' : 'Live Sync')}
                </span>
                <Wifi className="w-3 h-3 text-emerald-500 hidden sm:inline" />
              </button>
            )}
          </div>

          {/* Encryption & Security Shield */}
          <button
            onClick={onOpenCloudModal}
            title={language === 'ar' ? 'تشفير AES-256 ومصادقة متعددة العوامل' : 'AES-256 Encryption & MFA Active'}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden xl:inline text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              {mfaEnabled ? 'MFA+AES' : 'AES-256'}
            </span>
          </button>

          {/* Cloud Storage Connect */}
          <button
            onClick={onOpenCloudModal}
            title={language === 'ar' ? 'إدارة التخزين السحابي والنسخ الاحتياطي' : 'Cloud Storage & Backups'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
          >
            <Cloud className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Export / Import & Vercel Deploy */}
          <div className="flex items-center gap-1.5 border-s ps-2 ms-1 border-slate-200 dark:border-slate-800">
            {/* Vercel Deploy Trigger */}
            <button
              onClick={() => setIsVercelModalOpen(true)}
              title={language === 'ar' ? 'تشغيل ونشر الموقع على Vercel' : 'Deploy to Vercel'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm transition hover:scale-105"
            >
              <svg width="12" height="12" viewBox="0 0 76 65" fill="currentColor">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
              <span className="hidden sm:inline">{language === 'ar' ? 'نشر على Vercel' : 'Deploy Vercel'}</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              title={language === 'ar' ? 'تصدير المشروع بتنسيق متوافق' : 'Export Project'}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{language === 'ar' ? 'تصدير' : 'Export'}</span>
            </button>

            <label 
              title={language === 'ar' ? 'استيراد مشروع' : 'Import Project'}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg cursor-pointer bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <input 
                type="file" 
                accept=".json,.md" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Smart Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
              title={language === 'ar' ? 'التنبيهات الذكية' : 'Smart Notifications'}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 end-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {language === 'ar' ? 'التنبيهات الذكية' : 'Smart Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  >
                    {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400">
                      {language === 'ar' ? 'لا توجد تنبيهات جديدة' : 'No notifications'}
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 opacity-70'
                            : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">
                            {language === 'ar' ? n.titleAr : n.titleEn}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                          {language === 'ar' ? n.bodyAr : n.bodyEn}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 24/7 Support Chat Assistant Trigger */}
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
            title={language === 'ar' ? 'الدعم الفني المباشر 24/7' : '24/7 Live Support Chat'}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'دعم 24/7' : 'Support'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition"
            title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

        </div>
      </div>
    </header>
  );
};
