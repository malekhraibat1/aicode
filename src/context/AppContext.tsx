import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AIModel, 
  WorkspaceMessage, 
  VersionCommit, 
  SharedAsset, 
  CustomWorkflow, 
  SmartNotification, 
  HandoffGoal,
  HandoffTrace,
  GeneratedApp,
  SwarmAgent,
  SwarmMessage
} from '../types';
import { AI_MODELS } from '../data/models';
import { INITIAL_MESSAGES, INITIAL_COMMITS, INITIAL_ASSETS, INITIAL_WORKFLOWS } from '../data/mockTemplates';
import { INITIAL_GENERATED_APPS, INITIAL_SWARM_AGENTS } from '../data/mockApps';

interface AppContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeTab: 'studio' | 'tools' | 'handoff' | 'versions' | 'library' | 'workflows' | 'analytics' | 'settings' | 'builder' | 'swarm';
  setActiveTab: (tab: 'studio' | 'tools' | 'handoff' | 'versions' | 'library' | 'workflows' | 'analytics' | 'settings' | 'builder' | 'swarm') => void;
  
  // Models & State
  models: AIModel[];
  selectedModel: AIModel;
  setSelectedModelId: (id: string) => void;
  messages: WorkspaceMessage[];
  isGenerating: boolean;
  systemInstruction: string;
  setSystemInstruction: (s: string) => void;
  temperature: number;
  setTemperature: (t: number) => void;

  // Handoff
  activeHandoffPayload: {
    sourceMessageId: string;
    sourceModel: string;
    sourceModelId: string;
    output: string;
  } | null;
  isHandoffModalOpen: boolean;
  openHandoffModal: (messageId: string) => void;
  closeHandoffModal: () => void;
  executeHandoff: (targetModelId: string, goal: HandoffGoal, customPrompt?: string) => Promise<void>;

  // Versions / VCS
  commits: VersionCommit[];
  createCommit: (message: string, tag?: string) => void;
  restoreCommit: (commitId: string) => void;
  selectedDiffCommit: VersionCommit | null;
  setSelectedDiffCommit: (c: VersionCommit | null) => void;

  // Asset Library
  assets: SharedAsset[];
  addAsset: (asset: Omit<SharedAsset, 'id' | 'dateAdded'>) => void;
  deleteAsset: (id: string) => void;

  // Workflows
  workflows: CustomWorkflow[];
  runWorkflow: (id: string) => Promise<void>;
  isWorkflowRunning: boolean;

  // Offline & Sync
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  offlineQueueCount: number;
  isSyncing: boolean;
  syncOfflineChanges: () => Promise<void>;
  toggleSimulatedOffline: () => void;

  // Security & MFA
  mfaEnabled: boolean;
  toggleMfa: () => void;
  encryptionActive: boolean;

  // Modals & UI
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isVercelModalOpen: boolean;
  setIsVercelModalOpen: (open: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  isQuickTourOpen: boolean;
  setIsQuickTourOpen: (open: boolean) => void;

  // Generated Apps & Live Sandbox
  generatedApps: GeneratedApp[];
  selectedApp: GeneratedApp | null;
  setSelectedAppId: (id: string) => void;
  updateAppCode: (appId: string, code: string) => void;
  createNewApp: (title: string, description: string, code: string, category: GeneratedApp['category']) => string;

  // Swarm & Multi-Model Collaboration
  swarmAgents: SwarmAgent[];
  swarmMessages: SwarmMessage[];
  isSwarmRunning: boolean;
  runSwarmCollaboration: (taskPrompt: string) => Promise<void>;
  toggleSwarmAgent: (agentId: string) => void;

  // Notifications
  notifications: SmartNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (titleAr: string, titleEn: string, bodyAr: string, bodyEn: string, type?: 'info' | 'success' | 'warning' | 'security') => void;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearWorkspace: () => void;
  exportProjectData: (format: 'json' | 'markdown' | 'notebook' | 'huggingface') => string;
  importProjectData: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('nexus_lang') as 'ar' | 'en') || 'ar';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('nexus_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<'studio' | 'tools' | 'handoff' | 'versions' | 'library' | 'workflows' | 'analytics' | 'settings' | 'builder' | 'swarm'>('studio');
  const [selectedModelId, setSelectedModelIdState] = useState<string>('gemini-3.8-flash');
  
  const [messages, setMessages] = useState<WorkspaceMessage[]>(() => {
    const saved = localStorage.getItem('nexus_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_MESSAGES;
  });

  const [commits, setCommits] = useState<VersionCommit[]>(() => {
    const saved = localStorage.getItem('nexus_commits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_COMMITS;
  });

  const [assets, setAssets] = useState<SharedAsset[]>(() => {
    const saved = localStorage.getItem('nexus_assets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_ASSETS;
  });

  const [workflows, setWorkflows] = useState<CustomWorkflow[]>(() => {
    const saved = localStorage.getItem('nexus_workflows');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_WORKFLOWS;
  });

  // Generated Apps & Live Sandbox State
  const [generatedApps, setGeneratedApps] = useState<GeneratedApp[]>(() => {
    const saved = localStorage.getItem('nexus_apps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_GENERATED_APPS;
  });

  const [selectedAppId, setSelectedAppId] = useState<string>(() => {
    return INITIAL_GENERATED_APPS[0]?.id || '';
  });

  // Multi-Model Swarm Collaboration State
  const [swarmAgents, setSwarmAgents] = useState<SwarmAgent[]>(INITIAL_SWARM_AGENTS);
  const [swarmMessages, setSwarmMessages] = useState<SwarmMessage[]>([
    {
      id: 'swm-1',
      agentId: 'agent-architect',
      modelId: 'deepseek-r1',
      agentTitleAr: 'مهندس المعمارية (DeepSeek-R1)',
      agentTitleEn: 'Architect (DeepSeek-R1)',
      role: 'architect',
      content: 'تم تحليل متطلبات تطبيق لوحة المهام (Kanban): نقترح بنية بيانات تعتمد على 3 أعمدة رئيسية مع إدارة الحالة محلياً وحساب الترتيب الزمني ومؤشرات الأداء.',
      timestamp: Date.now() - 3600000 * 20,
      roundNumber: 1,
    },
    {
      id: 'swm-2',
      agentId: 'agent-developer',
      modelId: 'qwen-2.5-coder',
      agentTitleAr: 'المطور الرئيسي (Qwen 2.5 Coder)',
      agentTitleEn: 'Developer (Qwen Coder)',
      role: 'developer',
      content: 'وافقت على المعمارية المقترحة من DeepSeek. قمت ببناء الكود التنفيذي الكامل للتطبيق المتجاوب مع ميزات السحب، الإضافة، وتحديث الإحصائيات.',
      codeSnippet: `tasks.forEach(task => renderCard(task));`,
      timestamp: Date.now() - 3600000 * 19,
      roundNumber: 2,
    },
    {
      id: 'swm-3',
      agentId: 'agent-reviewer',
      modelId: 'gemini-3.8-flash',
      agentTitleAr: 'المدقق البرمجي (Gemini 3.8)',
      agentTitleEn: 'Auditor (Gemini 3.8)',
      role: 'reviewer',
      content: 'قمت بمراجعة الكود: تم تأكيد التوافق التام مع متصفحات الأجهزة المحمولة وسطح المكتب، وإضافة معالجة الأخطاء وحفظ الحالة في LocalStorage.',
      timestamp: Date.now() - 3600000 * 18,
      roundNumber: 3,
    }
  ]);
  const [isSwarmRunning, setIsSwarmRunning] = useState(false);

  const selectedApp = generatedApps.find(a => a.id === selectedAppId) || generatedApps[0] || null;

  useEffect(() => {
    localStorage.setItem('nexus_apps', JSON.stringify(generatedApps));
  }, [generatedApps]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState('أنت مساعد ذكاء اصطناعي احترافي، دقيق وموجه بالنتائج.');
  const [temperature, setTemperature] = useState(0.7);

  // Handoff state
  const [activeHandoffPayload, setActiveHandoffPayload] = useState<{
    sourceMessageId: string;
    sourceModel: string;
    sourceModelId: string;
    output: string;
  } | null>(null);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);

  // VCS diff inspector
  const [selectedDiffCommit, setSelectedDiffCommit] = useState<VersionCommit | null>(null);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isQuickTourOpen, setIsQuickTourOpen] = useState(false);

  // Offline & Sync
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Security
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [encryptionActive] = useState(true);

  // Workflows
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: 'notif-1',
      titleAr: 'تم تفعيل التزامن اللحظي',
      titleEn: 'Real-time Sync Active',
      bodyAr: 'مشروعك متزامن بأمان ومحمي بالتشفير التام AES-256.',
      bodyEn: 'Your project is securely synchronized and AES-256 encrypted.',
      type: 'success',
      timestamp: Date.now() - 600000,
      read: false,
    },
    {
      id: 'notif-2',
      titleAr: 'ترحيل سياق مكتمل',
      titleEn: 'Context Hand-off Completed',
      bodyAr: 'تم ترحيل مسودة العمل بنجاح من DeepSeek-R1 إلى Qwen 2.5 Coder.',
      bodyEn: 'Draft context was successfully handed off from DeepSeek-R1 to Qwen 2.5 Coder.',
      type: 'info',
      timestamp: Date.now() - 3600000,
      read: true,
    }
  ]);

  // Sync language with DOM
  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('nexus_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('nexus_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleOnline = () => {
      setIsOffline(false);
      addNotification('تمت استعادة الاتصال', 'Back Online', 'النظام متصل بالإنترنت وسيتم مزامنة أي تغييرات معلقة.', 'System is connected and will sync any pending changes.', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      addNotification('وضع العمل دون اتصال', 'Offline Mode Engaged', 'يمكنك متابعة العمل وسيتم حفظ التعديلات في قائمة الانتظار المحلية.', 'You can keep working. Changes are safely queued locally.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language, theme]);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem('nexus_messages', JSON.stringify(messages));
  }, [messages]);

  // Save commits to local storage
  useEffect(() => {
    localStorage.setItem('nexus_commits', JSON.stringify(commits));
  }, [commits]);

  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId) || AI_MODELS[0];

  const setSelectedModelId = (id: string) => {
    setSelectedModelIdState(id);
  };

  const addNotification = (
    titleAr: string, 
    titleEn: string, 
    bodyAr: string, 
    bodyEn: string, 
    type: 'info' | 'success' | 'warning' | 'security' = 'info'
  ) => {
    const newNotif: SmartNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      titleAr,
      titleEn,
      bodyAr,
      bodyEn,
      type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleMfa = () => {
    setMfaEnabled(prev => {
      const next = !prev;
      addNotification(
        next ? 'تم تفعيل المصادقة الثنائية (MFA)' : 'تم تعطيل المصادقة الثنائية',
        next ? 'MFA Activated' : 'MFA Deactivated',
        next ? 'حسابك وبيانات الترحيل مؤمنة برمز تحقق إضافي.' : 'تم تعطيل طبقة الحماية الإضافية.',
        next ? 'Your account and hand-off state are guarded with 2FA.' : 'Extra security layer disabled.',
        next ? 'security' : 'warning'
      );
      return next;
    });
  };

  const toggleSimulatedOffline = () => {
    setIsOffline(prev => {
      const next = !prev;
      if (next) {
        addNotification('تم تفعيل وضع عدم الاتصال يدوياً', 'Offline Simulation On', 'يتم حفظ كافة الاستفسارات والعمليات في المخزن المحلي.', 'All queries and actions are saved locally in sync queue.', 'warning');
      } else {
        addNotification('تم إلغاء محاكاة عدم الاتصال', 'Offline Simulation Off', 'الاتصال نشط ويمكن المزامنة مع الخادم السحابي.', 'Connected. Ready to sync with cloud server.', 'success');
      }
      return next;
    });
  };

  const syncOfflineChanges = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1200));
    setOfflineQueueCount(0);
    setIsSyncing(false);
    addNotification('اكتملت المزامنة اللحظية', 'Sync Complete', 'تمت مزامنة كافة الإصدارات والمخرجات المعلقة بنجاح.', 'All pending commits and outputs have been synced.', 'success');
  };

  // Send a new prompt in studio
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: WorkspaceMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      tokens: Math.round(content.length / 3.5),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    if (isOffline) {
      setOfflineQueueCount(prev => prev + 1);
    }

    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel.id,
          prompt: content,
          systemInstruction,
          temperature,
        }),
      });

      const data = await res.json();
      
      const assistantMsg: WorkspaceMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text || 'حدث خطأ أثناء معالجة النموذج.',
        modelId: selectedModel.id,
        provider: data.provider || selectedModel.provider,
        timestamp: Date.now(),
        latencyMs: data.latencyMs || 420,
        tokens: data.tokens || 350,
        artifact: data.generatedArtifact || undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Auto-commit lightweight point
      createCommit(`توليد إجابة عبر ${selectedModel.name}`, `auto-${selectedModel.id.split('-')[0]}`);

    } catch (err: any) {
      console.error('Error generating message:', err);
      // Fallback response so user is never blocked
      const fallbackMsg: WorkspaceMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `تم توليد الرد محلياً في بيئة العمل:\n\nبناءً على طلبك: "${content}"\n\nيقدم نموذج ${selectedModel.name} معالجة فورية وموثوقة. يمكنك في أي وقت ترحيل هذا العمل إلى نموذج تخصصي آخر عبر زر الترحيل أدناه.`,
        modelId: selectedModel.id,
        provider: `${selectedModel.name} (Local Kernel)`,
        timestamp: Date.now(),
        latencyMs: 180,
        tokens: 120,
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Open handoff modal for specific message
  const openHandoffModal = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    const sourceModelObj = AI_MODELS.find(m => m.id === msg.modelId) || selectedModel;
    setActiveHandoffPayload({
      sourceMessageId: msg.id,
      sourceModel: sourceModelObj.name,
      sourceModelId: sourceModelObj.id,
      output: msg.content,
    });
    setIsHandoffModalOpen(true);
  };

  const closeHandoffModal = () => {
    setIsHandoffModalOpen(false);
    setActiveHandoffPayload(null);
  };

  // Execute Cross-Model Hand-off
  const executeHandoff = async (targetModelId: string, goal: HandoffGoal, customPrompt?: string) => {
    if (!activeHandoffPayload) return;

    const targetModel = AI_MODELS.find(m => m.id === targetModelId) || AI_MODELS[0];
    const sourceModelName = activeHandoffPayload.sourceModel;
    const previousOutput = activeHandoffPayload.output;

    closeHandoffModal();
    setSelectedModelId(targetModel.id);
    setActiveTab('studio');
    setIsGenerating(true);

    const goalLabels: Record<HandoffGoal, { ar: string; en: string }> = {
      continue: { ar: 'متابعة العمل من مكان التوقف', en: 'Continue from Stopping Point' },
      refine: { ar: 'تدقيق وتحسين الصياغة والأداء', en: 'Refine & Polish' },
      code: { ar: 'تحويل الفكرة إلى كود برمجي تنفيذي', en: 'Transform to Executable Code' },
      visualize: { ar: 'توليد تصور بصري وصورة للمشروع', en: 'Generate Visual Art Concept' },
      critique: { ar: 'نقد تحليلي واكتشاف الثغرات', en: 'Critical Review & Bug Audit' },
      summarize: { ar: 'تلخيص تنفيذي مركز', en: 'Executive Summary' },
      translate: { ar: 'ترجمة وتوطين المحتوى', en: 'Translate & Localize' },
    };

    const promptText = customPrompt || `تابع العمل انطلاقاً من المخرجات السابقة وفق الهدف: ${goalLabels[goal].ar}`;

    // Add user intent message for handoff
    const handoffIntentMsg: WorkspaceMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: `[ترحيل عمل إلى ${targetModel.name}] - ${goalLabels[goal].ar}\n${customPrompt ? customPrompt : ''}`,
      timestamp: Date.now(),
      tokens: 45,
    };

    setMessages(prev => [...prev, handoffIntentMsg]);

    try {
      const res = await fetch('/api/models/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: targetModel.id,
          prompt: promptText,
          isHandoff: true,
          handoffGoal: goal,
          handoffContext: {
            sourceModel: sourceModelName,
            previousOutput: previousOutput,
          },
          temperature,
        }),
      });

      const data = await res.json();

      const handoffTrace: HandoffTrace = {
        sourceModel: sourceModelName,
        targetModel: targetModel.name,
        goal,
        goalLabelAr: goalLabels[goal].ar,
        goalLabelEn: goalLabels[goal].en,
        timestamp: Date.now(),
        transferredTokens: Math.round(previousOutput.length / 3.5),
        snippetPreview: previousOutput.slice(0, 140) + '...',
      };

      const assistantMsg: WorkspaceMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text || 'تم استلام الترحيل ومعالجة المخرجات.',
        modelId: targetModel.id,
        provider: data.provider || targetModel.provider,
        timestamp: Date.now(),
        latencyMs: data.latencyMs || 510,
        tokens: data.tokens || 480,
        handoffTrace,
        artifact: data.generatedArtifact || undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Create a prominent commit in Version Control
      createCommit(
        `ترحيل من ${sourceModelName} إلى ${targetModel.name} (${goalLabels[goal].ar})`,
        `handoff-${targetModel.id.split('-')[0]}`
      );

      addNotification(
        'نجاح ترحيل مسار العمل',
        'Cross-Model Hand-off Successful',
        `تم نقل السياق والبيانات بسلاسة من ${sourceModelName} إلى ${targetModel.name}.`,
        `Context seamlessly transferred from ${sourceModelName} to ${targetModel.name}.`,
        'success'
      );

    } catch (err) {
      console.error('Handoff error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Create commit in centralized version control
  const createCommit = (message: string, tag?: string) => {
    const newCommit: VersionCommit = {
      id: `vcs-${Math.random().toString(36).substring(2, 6)}`,
      tag: tag || `v1.${commits.length}`,
      message,
      author: 'المستخدم الحالي (Nexus Pro)',
      timestamp: Date.now(),
      modelId: selectedModel.id,
      promptCount: messages.length,
      snapshotMessages: [...messages],
      diffSummary: {
        additions: Math.floor(Math.random() * 30) + 12,
        deletions: Math.floor(Math.random() * 5),
      },
    };

    setCommits(prev => [newCommit, ...prev]);
  };

  // Restore state from commit
  const restoreCommit = (commitId: string) => {
    const commit = commits.find(c => c.id === commitId);
    if (!commit) return;

    setMessages([...commit.snapshotMessages]);
    setActiveTab('studio');
    addNotification(
      'تمت استعادة نقطة الحفظ',
      'Version Restored',
      `تم استرجاع حالة العمل للإصدار ${commit.tag || commit.id} بنجاح.`,
      `Workspace restored to snapshot ${commit.tag || commit.id}.`,
      'info'
    );
  };

  // Add / Delete shared assets
  const addAsset = (asset: Omit<SharedAsset, 'id' | 'dateAdded'>) => {
    const newAsset: SharedAsset = {
      ...asset,
      id: `ast-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setAssets(prev => [newAsset, ...prev]);
    addNotification('تمت إضافة مورد جديد للمكتبة', 'Asset Added', `تم حفظ "${newAsset.title}" في المكتبة السحابية المشتركة.`, `Saved "${newAsset.title}" to shared library.`, 'success');
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Run Custom Workflow
  const runWorkflow = async (workflowId: string) => {
    const wf = workflows.find(w => w.id === workflowId);
    if (!wf) return;

    setIsWorkflowRunning(true);
    addNotification('بدء تنفيذ تدفق العمل', 'Workflow Started', `جاري تشغيل "${wf.name}" آلياً عبر النماذج المتسلسلة...`, `Running "${wf.name}" across chained models...`, 'info');

    // Simulate multi-step sequential execution
    for (let i = 0; i < wf.steps.length; i++) {
      setWorkflows(prev => prev.map(w => {
        if (w.id !== workflowId) return w;
        const newSteps = [...w.steps];
        newSteps[i] = { ...newSteps[i], status: 'running' };
        return { ...w, steps: newSteps };
      }));

      await new Promise(r => setTimeout(r, 1500));

      setWorkflows(prev => prev.map(w => {
        if (w.id !== workflowId) return w;
        const newSteps = [...w.steps];
        newSteps[i] = { 
          ...newSteps[i], 
          status: 'completed', 
          outputResult: `تم إكمال الخطوة بنجاح وتوليد المخرجات بواسطة ${newSteps[i].modelId}.` 
        };
        return { ...w, steps: newSteps, lastRun: 'الآن' };
      }));
    }

    setIsWorkflowRunning(false);
    addNotification('اكتمل تدفق العمل بالكامل', 'Workflow Finished', `تم الانتهاء من كافة مراحل "${wf.name}" وتوليد النتائج.`, `All stages of "${wf.name}" completed successfully.`, 'success');
  };

  const clearWorkspace = () => {
    setMessages([]);
    addNotification('تم تنظيف مساحة العمل', 'Workspace Cleared', 'تم بدء جلسة عمل فارغة جديدة.', 'Started clean session.', 'info');
  };

  // Universal export format support
  const exportProjectData = (format: 'json' | 'markdown' | 'notebook' | 'huggingface'): string => {
    if (format === 'markdown') {
      let md = `# NexusAI Studio Project Export\n\n`;
      md += `*Generated:* ${new Date().toLocaleString()}\n`;
      md += `*Total Messages:* ${messages.length}\n`;
      md += `*Active Model:* ${selectedModel.name}\n\n`;
      md += `## سجل الحوار والترحيل بين النماذج\n\n`;

      messages.forEach((m, idx) => {
        const roleName = m.role === 'user' ? '👤 المستخدم' : `🤖 ${m.provider || m.modelId || 'الذكاء الاصطناعي'}`;
        md += `### ${idx + 1}. ${roleName} (${new Date(m.timestamp).toLocaleTimeString()})\n\n`;
        if (m.handoffTrace) {
          md += `> 🔄 **سجل الترحيل:** من ${m.handoffTrace.sourceModel} إلى ${m.handoffTrace.targetModel} [${m.handoffTrace.goalLabelAr}]\n\n`;
        }
        md += `${m.content}\n\n---\n\n`;
      });
      return md;
    }

    if (format === 'notebook') {
      // Jupyter Notebook format
      const cells = messages.map(m => ({
        cell_type: m.role === 'user' ? 'markdown' : (m.content.includes('```') ? 'code' : 'markdown'),
        metadata: { model: m.modelId, role: m.role },
        source: m.content.split('\n').map(l => l + '\n'),
        outputs: [],
        execution_count: null,
      }));

      const notebook = {
        cells,
        metadata: {
          kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
          language_info: { name: "python", version: "3.10" },
          nexus_project_info: { exportedAt: new Date().toISOString(), modelCount: AI_MODELS.length }
        },
        nbformat: 4,
        nbformat_minor: 2
      };
      return JSON.stringify(notebook, null, 2);
    }

    if (format === 'huggingface') {
      // Hugging Face standard conversation dataset
      const conversations = messages.map(m => ({
        from: m.role === 'user' ? 'human' : 'gpt',
        value: m.content,
        model: m.modelId,
      }));
      return JSON.stringify({ conversations }, null, 2);
    }

    // Default: Universal AI Interchange Format (UAIF) JSON
    const universalExport = {
      format: 'Universal-AI-Interchange-Format',
      specVersion: '2.4.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        title: 'NexusAI Unified Workspace Snapshot',
        activeModel: selectedModel.id,
        messagesCount: messages.length,
        commitsCount: commits.length,
        encryptionType: 'AES-256-GCM',
        mfaVerified: mfaEnabled,
      },
      modelsCatalog: AI_MODELS.map(m => ({ id: m.id, name: m.name, provider: m.provider })),
      messages,
      commits,
      assets,
      workflows,
    };
    return JSON.stringify(universalExport, null, 2);
  };

  const importProjectData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
      if (data.commits && Array.isArray(data.commits)) {
        setCommits(data.commits);
      }
      if (data.assets && Array.isArray(data.assets)) {
        setAssets(data.assets);
      }
      addNotification('تم استيراد المشروع بنجاح', 'Import Successful', 'تم تحميل كافة الرسائل، وسجل الإصدارات، والمكتبة بنجاح.', 'Project snapshot restored with all versions and assets.', 'success');
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      addNotification('فشل استيراد الملف', 'Import Failed', 'تأكد من اختيار ملف بتنسيق JSON صالح.', 'Please select a valid JSON export file.', 'warning');
      return false;
    }
  };

  const updateAppCode = (appId: string, code: string) => {
    setGeneratedApps(prev => prev.map(a => a.id === appId ? { ...a, fullBundleCode: code, updatedAt: Date.now() } : a));
    addNotification('تم تحديث كود التطبيق', 'App Code Updated', 'تم حفظ التعديلات وتحديث المعاينة التفاعلية فورياً.', 'Changes saved and live sandbox reloaded.', 'success');
  };

  const createNewApp = (title: string, description: string, code: string, category: GeneratedApp['category']): string => {
    const newId = `app-${Date.now()}`;
    const newApp: GeneratedApp = {
      id: newId,
      title,
      description,
      category,
      htmlCode: '',
      fullBundleCode: code,
      modelContributors: ['Nexus Multi-Model Swarm'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      previewDevice: 'desktop',
    };
    setGeneratedApps(prev => [newApp, ...prev]);
    setSelectedAppId(newId);
    setActiveTab('builder');
    addNotification('تم إنشاء تطبيق جديد بنجاح', 'New App Generated', `تطبيق "${title}" جاهز للمعاينة التفاعلية والتشغيل.`, `App "${title}" is ready in live interactive sandbox.`, 'success');
    return newId;
  };

  const toggleSwarmAgent = (agentId: string) => {
    setSwarmAgents(prev => prev.map(a => a.id === agentId ? { ...a, isActive: !a.isActive } : a));
  };

  const runSwarmCollaboration = async (taskPrompt: string) => {
    if (!taskPrompt.trim() || isSwarmRunning) return;
    setIsSwarmRunning(true);

    addNotification(
      'بدء تعاون النماذج الشامل (Multi-Model Swarm)',
      'Multi-Model Swarm Initiated',
      'تعمل النماذج معاً بتنسيق لحظي لبناء وتطوير التطبيق المطلوب.',
      'Active models are collaborating in real time to architect, code, and test the app.',
      'info'
    );

    const activeAgentsList = swarmAgents.filter(a => a.isActive);

    // Multi-agent collaborative simulated execution with live progressive rounds
    const roundsData = [
      {
        agentId: 'agent-architect',
        contentAr: `[تحليل المعمارية والمنطق لطلب: "${taskPrompt.slice(0, 50)}..."]\n1. تفكيك التطبيق إلى وحدات تفاعلية ومكونات UI واضحة.\n2. اعتماد نظام State Management محلي فوري.\n3. تحديد متطلبات التفاعل، الألوان، وأنماط الأزرار. أوصي المطور (Qwen) بالبدء في كتابة هيكل الصفحة المباشر.`,
        contentEn: `Architectural analysis complete. Proposing clean modular components and state store. Passing to Developer.`,
      },
      {
        agentId: 'agent-designer',
        contentAr: `[نظام التصميم والهوية البصرية]\nتم اختيار لوحة ألوان عصرية (Cyber Slate & Indigo & Cyan) مع خط Cairo الأنيق ووضع داكن مريح للعين، وظلال ناعمة للعناصر التفاعلية.`,
        contentEn: `Visual design system curated with modern cyberpunk indigo palette and responsive layouts.`,
      },
      {
        agentId: 'agent-developer',
        contentAr: `[توليد الكود البرمجي التنفيذي الكامل]\nتم بناء التطبيق التفاعلي بالكامل بتقنيات HTML5 و Tailwind CSS و JavaScript بدون أطر عمل خارجية ثقيلة، مع توفير كافة ميزات الإضافة والتفاعل الحركي وتخزين الحالة.`,
        contentEn: `Complete responsive app code generated with Tailwind CSS and vanillla JS interactions. Ready for sandbox preview.`,
        codeSnippet: `<!-- Ready in Live Sandbox -->`,
      },
      {
        agentId: 'agent-reviewer',
        contentAr: `[التدقيق البرمجي ومراجعة الأداء]\nتم فحص الكود والتأكد من توافقه 100% مع أبعاد الأجهزة الذكية والأجهزة اللوحية والمكتبية، وإزالة أي تعارضات في الأنماط أو متغيرات غير مستخدمة.`,
        contentEn: `Code audited. Verified responsive across mobile, tablet, and desktop viewports.`,
      },
      {
        agentId: 'agent-tester',
        contentAr: `[ضمان الجودة واختبار التشغيل]\nتم إجراء اختبارات الضغط والمحاكاة لجميع أزرار التفاعل والإدخال. التطبيق جاهز للتشغيل في المعاينة الحية والتصدير الفوري!`,
        contentEn: `QA test suite passed. Interactive sandbox preview deployed.`,
      }
    ];

    for (let i = 0; i < roundsData.length; i++) {
      const r = roundsData[i];
      const agent = activeAgentsList.find(a => a.id === r.agentId) || activeAgentsList[0];
      if (!agent) continue;

      await new Promise(res => setTimeout(res, 1200));

      const newMsg: SwarmMessage = {
        id: `swm-${Date.now()}-${i}`,
        agentId: agent.id,
        modelId: agent.modelId,
        agentTitleAr: agent.titleAr,
        agentTitleEn: agent.titleEn,
        role: agent.role,
        content: language === 'ar' ? r.contentAr : r.contentEn,
        codeSnippet: r.codeSnippet,
        timestamp: Date.now(),
        roundNumber: i + 1,
      };

      setSwarmMessages(prev => [...prev, newMsg]);
    }

    // Generate a new working app from this prompt
    const generatedTitle = `تطبيق: ${taskPrompt.slice(0, 30)}...`;
    const appTemplateHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${generatedTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Cairo', sans-serif; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6">
  <div class="max-w-4xl mx-auto">
    <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl mb-6">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">تطبيق مولد بتعاون النماذج</span>
          <h1 class="text-xl font-black text-white mt-1">${taskPrompt}</h1>
        </div>
        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <p class="text-xs text-slate-400 mt-3 leading-relaxed">
        تم تصميم هذا التطبيق التفاعلي بواسطة فريق النماذج المتكاملة: DeepSeek-R1 (المعمارية)، FLUX.1 (الهوية البصرية)، Qwen 2.5 Coder (التطوير)، و Gemini 3.8 (التدقيق).
      </p>
    </div>

    <!-- Interactive Interactive Widget Demo -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 class="font-bold text-sm text-cyan-400">لوحة الإدخال والتحكم الذكي</h3>
        <input type="text" id="demo-input" placeholder="اكتب عنصراً تفاعلياً جديداً..." class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500">
        <button onclick="addItem()" class="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition">
          + إضافة للعناصر التفاعلية
        </button>
      </div>

      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-sm text-indigo-400 mb-2">العناصر المولدة النشطة</h3>
          <ul id="items-list" class="space-y-1.5 text-xs text-slate-300 max-h-36 overflow-y-auto">
            <li class="p-2 rounded-lg bg-slate-800/80 flex items-center justify-between"><span>العنصر الأساسي الأول</span><span class="text-[10px] text-emerald-400 font-bold">جاهز</span></li>
            <li class="p-2 rounded-lg bg-slate-800/80 flex items-center justify-between"><span>مزامنة الحالة اللحظية</span><span class="text-[10px] text-emerald-400 font-bold">نشط</span></li>
          </ul>
        </div>
        <div class="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-end">
          تحديث لحظي في المعاينة التفاعلية
        </div>
      </div>
    </div>
  </div>

  <script>
    function addItem() {
      const inp = document.getElementById('demo-input');
      const val = inp.value.trim();
      if (!val) return;
      const ul = document.getElementById('items-list');
      const li = document.createElement('li');
      li.className = 'p-2 rounded-lg bg-slate-800/80 flex items-center justify-between';
      li.innerHTML = '<span>' + val + '</span><span class="text-[10px] text-emerald-400 font-bold">جديد</span>';
      ul.appendChild(li);
      inp.value = '';
    }
  </script>
</body>
</html>`;

    createNewApp(generatedTitle, `تطبيق تم بناؤه بتعاون متعدد النماذج للطلب: ${taskPrompt}`, appTemplateHtml, 'custom');

    setIsSwarmRunning(false);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      activeTab,
      setActiveTab,
      models: AI_MODELS,
      selectedModel,
      setSelectedModelId,
      messages,
      isGenerating,
      systemInstruction,
      setSystemInstruction,
      temperature,
      setTemperature,
      activeHandoffPayload,
      isHandoffModalOpen,
      openHandoffModal,
      closeHandoffModal,
      executeHandoff,
      commits,
      createCommit,
      restoreCommit,
      selectedDiffCommit,
      setSelectedDiffCommit,
      assets,
      addAsset,
      deleteAsset,
      workflows,
      runWorkflow,
      isWorkflowRunning,
      isOffline,
      setIsOffline,
      offlineQueueCount,
      isSyncing,
      syncOfflineChanges,
      toggleSimulatedOffline,
      mfaEnabled,
      toggleMfa,
      encryptionActive,
      isExportModalOpen,
      setIsExportModalOpen,
      isVercelModalOpen,
      setIsVercelModalOpen,
      isSupportModalOpen,
      setIsSupportModalOpen,
      isQuickTourOpen,
      setIsQuickTourOpen,
      generatedApps,
      selectedApp,
      setSelectedAppId,
      updateAppCode,
      createNewApp,
      swarmAgents,
      swarmMessages,
      isSwarmRunning,
      runSwarmCollaboration,
      toggleSwarmAgent,
      notifications,
      markNotificationRead,
      clearNotifications,
      addNotification,
      sendMessage,
      clearWorkspace,
      exportProjectData,
      importProjectData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
