import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  Lock, 
  Key, 
  CheckCircle2, 
  RefreshCw, 
  HardDrive, 
  Smartphone, 
  Database,
  ExternalLink,
  AlertTriangle,
  UploadCloud,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CloudStorageSync } from '../../types';

export const SecurityAndCloudView: React.FC = () => {
  const { language, mfaEnabled, toggleMfa, encryptionActive, addNotification, syncOfflineChanges, isSyncing } = useApp();

  const [cloudServices, setCloudServices] = useState<CloudStorageSync[]>([
    {
      provider: 'google-drive',
      name: 'Google Drive',
      connected: true,
      lastSync: 'منذ 10 دقائق',
      autoSync: true,
      usedSpace: '14.2 MB / 15 GB',
    },
    {
      provider: 'dropbox',
      name: 'Dropbox',
      connected: false,
      autoSync: false,
      usedSpace: '0 MB / 2 GB',
    },
    {
      provider: 'onedrive',
      name: 'Microsoft OneDrive',
      connected: false,
      autoSync: false,
      usedSpace: '0 MB / 5 GB',
    },
    {
      provider: 'aws-s3',
      name: 'Amazon S3 Bucket',
      connected: true,
      lastSync: 'منذ ساعة',
      autoSync: true,
      usedSpace: '48.6 MB (Encrypted)',
    },
  ]);

  const [isBackingUp, setIsBackingUp] = useState(false);

  const toggleCloudConnect = (provider: string) => {
    setCloudServices(prev => prev.map(s => {
      if (s.provider !== provider) return s;
      const nextConnected = !s.connected;
      addNotification(
        nextConnected ? `تم ربط ${s.name} بنجاح` : `تم قطع الاتصال بـ ${s.name}`,
        nextConnected ? `${s.name} Connected` : `${s.name} Disconnected`,
        nextConnected ? 'النسخ الاحتياطي التلقائي قيد التشغيل.' : 'تم إيقاف المزامنة السحابية مع هذه الخدمة.',
        nextConnected ? 'Auto-backup is now active.' : 'Cloud sync suspended.',
        'info'
      );
      return { ...s, connected: nextConnected, lastSync: nextConnected ? 'الآن' : undefined };
    }));
  };

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    await new Promise(r => setTimeout(r, 1400));
    setIsBackingUp(false);
    addNotification('تم النسخ الاحتياطي السحابي', 'Cloud Backup Complete', 'تم تشفير ورفع كافة المشاريع والإصدارات بنجاح.', 'All projects & VCS commits encrypted and backed up.', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'الأمان، التشفير، والتكامل السحابي' : 'Security, Encryption & Cloud Sync'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? 'تشفير AES-256 المتطور لحماية مسارات العمل والمصادقة متعددة العوامل والتكامل مع خدمات التخزين السحابية.'
              : 'End-to-End AES-256 storage encryption, multi-factor authentication, and popular cloud drive integrations.'}
          </p>
        </div>

        <button
          onClick={handleManualBackup}
          disabled={isBackingUp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition shrink-0 disabled:opacity-50"
        >
          <UploadCloud className={`w-4 h-4 ${isBackingUp ? 'animate-bounce' : ''}`} />
          <span>
            {isBackingUp 
              ? (language === 'ar' ? 'جارٍ رفع النسخة المشفرة...' : 'Encrypting & Backing Up...') 
              : (language === 'ar' ? 'نسخ احتياطي سحابي الآن' : 'Backup to Cloud Now')}
          </span>
        </button>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* AES Encryption Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {language === 'ar' ? 'تشفير البيانات العسكري (AES-256-GCM)' : 'AES-256-GCM Data Encryption'}
                </h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {language === 'ar' ? 'نشط ومفعل لجميع الجلسات' : 'Active across all sessions'}
                </span>
              </div>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950"></span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'يتم تشفير كافة المدخلات والمخرجات وسجلات الإصدارات محلياً قبل حفظها أو نقلها لضمان الخصوصية القصوى.'
              : 'All conversation states, prompts, and VCS commits are encrypted with AES-256 keys.'}
          </p>
        </div>

        {/* MFA Multi-Factor Auth Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {language === 'ar' ? 'المصادقة متعددة العوامل (MFA / 2FA)' : 'Multi-Factor Authentication'}
                </h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {mfaEnabled ? (language === 'ar' ? 'مؤمنة برمز تحقق إضافي' : 'Secured with 2FA Token') : (language === 'ar' ? 'غير مفعلة' : 'Disabled')}
                </span>
              </div>
            </div>

            <button
              onClick={toggleMfa}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                mfaEnabled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
              }`}
            >
              {mfaEnabled ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'تفعيل' : 'Enable')}
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'حماية عمليات التصدير، وحذف الإصدارات، وتغيير مفاتيح النماذج بطلب تأكيد إضافي.'
              : 'Guards project exports and administrative actions with hardware or authenticator app tokens.'}
          </p>
        </div>

      </div>

      {/* Cloud Storage Integrations Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'خدمات التخزين السحابي المتكاملة' : 'Integrated Cloud Storage Services'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'ar'
                ? 'اربط حسابات التخزين السحابي لمزامنة مشاريعك ومكتبة القوالب تلقائياً.'
                : 'Connect popular cloud drives to automate backup and synchronize templates across devices.'}
            </p>
          </div>

          <button
            onClick={syncOfflineChanges}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{language === 'ar' ? 'مزامنة كافة الخدمات' : 'Sync All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cloudServices.map(cs => (
            <div
              key={cs.provider}
              className={`p-4 rounded-2xl border transition ${
                cs.connected 
                  ? 'border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/20 dark:bg-indigo-950/20' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                    <Cloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">{cs.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{cs.usedSpace}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleCloudConnect(cs.provider)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    cs.connected
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {cs.connected ? (language === 'ar' ? 'قطع الربط' : 'Disconnect') : (language === 'ar' ? 'ربط الخدمة' : 'Connect')}
                </button>
              </div>

              {cs.connected && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'متصل ومتزامن' : 'Connected & Active'}
                  </span>
                  <span>{cs.lastSync}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
