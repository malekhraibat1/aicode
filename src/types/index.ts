export type ModelCategory = 'llm' | 'coding' | 'vision' | 'audio' | 'reasoning' | 'research';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  descriptionAr: string;
  descriptionEn: string;
  contextWindow: string;
  speedRating: 'فائق السرعة' | 'سريع' | 'متوسط' | 'تحليلي عميق';
  speedRatingEn: 'Ultra Fast' | 'Fast' | 'Balanced' | 'Deep Reasoning';
  isFree: boolean;
  isLiveApi?: boolean;
  badge?: string;
  tags: string[];
  capabilities: {
    code: boolean;
    reasoning: boolean;
    vision: boolean;
    audio: boolean;
    streaming: boolean;
  };
}

export type HandoffGoal = 
  | 'continue'      // متابعة العمل من مكان التوقف
  | 'refine'        // تدقيق وتحسين الصياغة
  | 'code'          // تحويل الفكرة إلى كود برمجي
  | 'visualize'     // توليد تصور بصري أو صورة
  | 'critique'      // نقد تحليلي واكتشاف الثغرات
  | 'summarize'     // تلخيص تنفيذي مركز
  | 'translate';    // ترجمة وتوطين

export interface HandoffTrace {
  sourceModel: string;
  targetModel: string;
  goal: HandoffGoal;
  goalLabelAr: string;
  goalLabelEn: string;
  timestamp: number;
  transferredTokens: number;
  snippetPreview: string;
}

export interface WorkspaceMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelId?: string;
  provider?: string;
  timestamp: number;
  latencyMs?: number;
  tokens?: number;
  handoffTrace?: HandoffTrace | null;
  artifact?: {
    type: 'image' | 'code' | 'audio' | 'document';
    title: string;
    aspectRatio?: string;
    downloadUrl?: string;
  };
}

export interface VersionCommit {
  id: string;
  tag?: string;
  message: string;
  author: string;
  timestamp: number;
  modelId: string;
  promptCount: number;
  snapshotMessages: WorkspaceMessage[];
  diffSummary: {
    additions: number;
    deletions: number;
  };
}

export interface SharedAsset {
  id: string;
  title: string;
  category: 'prompt' | 'code' | 'doc' | 'image' | 'system';
  content: string;
  description: string;
  tags: string[];
  dateAdded: string;
  sizeKb: number;
  author: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  modelId: string;
  actionGoal: HandoffGoal;
  promptTemplate: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  outputResult?: string;
}

export interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  webhookEnabled: boolean;
  lastRun?: string;
}

export interface SmartNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  type: 'info' | 'success' | 'warning' | 'security';
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface CloudStorageSync {
  provider: 'google-drive' | 'dropbox' | 'onedrive' | 'aws-s3';
  name: string;
  connected: boolean;
  lastSync?: string;
  autoSync: boolean;
  usedSpace: string;
}

export interface GeneratedApp {
  id: string;
  title: string;
  description: string;
  category: 'saas' | 'ecommerce' | 'game' | 'dashboard' | 'tool' | 'custom';
  htmlCode: string;
  cssCode?: string;
  jsCode?: string;
  fullBundleCode: string;
  modelContributors: string[];
  createdAt: number;
  updatedAt: number;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
}

export type SwarmRoleType = 'architect' | 'developer' | 'designer' | 'reviewer' | 'tester';

export interface SwarmAgent {
  id: string;
  modelId: string;
  role: SwarmRoleType;
  titleAr: string;
  titleEn: string;
  avatarColor: string;
  isActive: boolean;
  systemPrompt: string;
}

export interface SwarmMessage {
  id: string;
  agentId: string;
  modelId: string;
  agentTitleAr: string;
  agentTitleEn: string;
  role: SwarmRoleType;
  content: string;
  codeSnippet?: string;
  timestamp: number;
  roundNumber: number;
}

export interface AppBuilderTool {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  category: 'ui' | 'backend' | 'database' | 'testing' | 'prompts';
  defaultPrompt: string;
  targetModelId: string;
}

export interface TolzyAITool {
  id: string;
  name: string;
  category: 'coding' | 'vision' | 'audio' | 'video' | 'writing' | 'productivity' | 'research' | 'learning';
  categoryAr: string;
  categoryEn: string;
  pricing: 'free' | 'freemium' | 'open-source';
  pricingLabelAr: string;
  pricingLabelEn: string;
  freeAllowanceAr: string;
  freeAllowanceEn: string;
  descriptionAr: string;
  descriptionEn: string;
  url: string;
  tags: string[];
  isFeatured?: boolean;
  tolzyVerified?: boolean;
  iconBg: string;
}
