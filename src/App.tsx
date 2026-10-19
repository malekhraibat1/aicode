/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { UnifiedStudio } from './components/Studio/UnifiedStudio';
import { HandoffHubView } from './components/Handoff/HandoffHubView';
import { HandoffModal } from './components/Handoff/HandoffModal';
import { VersionHistory } from './components/Versions/VersionHistory';
import { AssetLibrary } from './components/Library/AssetLibrary';
import { WorkflowBuilder } from './components/Workflows/WorkflowBuilder';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { SecurityAndCloudView } from './components/Security/SecurityAndCloudView';
import { AppSandboxView } from './components/Builder/AppSandboxView';
import { TolzyToolsView } from './components/Tools/TolzyToolsView';
import { ModelSwarmView } from './components/Swarm/ModelSwarmView';
import { ExportModal } from './components/Export/ExportModal';
import { VercelDeployModal } from './components/Export/VercelDeployModal';
import { SupportChatModal } from './components/Support/SupportChatModal';
import { QuickTourModal } from './components/Tour/QuickTourModal';
import { 
  Cpu, 
  Share2, 
  GitBranch, 
  FolderGit2, 
  Workflow, 
  BarChart3, 
  ShieldCheck,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, language, isVercelModalOpen, setIsVercelModalOpen } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'studio':
        return <UnifiedStudio />;
      case 'builder':
        return <AppSandboxView />;
      case 'tools':
        return <TolzyToolsView />;
      case 'swarm':
        return <ModelSwarmView />;
      case 'handoff':
        return <HandoffHubView />;
      case 'versions':
        return <VersionHistory />;
      case 'library':
        return <AssetLibrary />;
      case 'workflows':
        return <WorkflowBuilder />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SecurityAndCloudView />;
      default:
        return <UnifiedStudio />;
    }
  };

  const mobileTabs = [
    { id: 'studio', labelAr: 'الاستوديو', labelEn: 'Studio', icon: Cpu },
    { id: 'builder', labelAr: 'المعاينة', labelEn: 'Sandbox', icon: Layers },
    { id: 'tools', labelAr: 'أدوات تولزي', labelEn: 'Tolzy Tools', icon: Compass },
    { id: 'swarm', labelAr: 'الفريق', labelEn: 'Swarm', icon: Sparkles },
    { id: 'handoff', labelAr: 'الترحيل', labelEn: 'Handoff', icon: Share2 },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Header onOpenCloudModal={() => setActiveTab('settings')} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for desktop/tablet */}
        <Sidebar />

        {/* Dynamic Main View */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around z-30">
        {mobileTabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-bold transition ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'ar' ? t.labelAr : t.labelEn}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Modals */}
      <HandoffModal />
      <ExportModal />
      <VercelDeployModal isOpen={isVercelModalOpen} onClose={() => setIsVercelModalOpen(false)} />
      <SupportChatModal />
      <QuickTourModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
