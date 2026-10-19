import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  Filter, 
  Copy, 
  Check, 
  Trash2, 
  ArrowUpRight, 
  Download, 
  Tag, 
  Code2, 
  FileText, 
  FileCode, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SharedAsset } from '../../types';

export const AssetLibrary: React.FC = () => {
  const { language, assets, addAsset, deleteAsset, setActiveTab, sendMessage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Asset Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SharedAsset['category']>('prompt');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseInStudio = (content: string) => {
    sendMessage(content);
    setActiveTab('studio');
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addAsset({
      title: newTitle,
      category: newCategory,
      description: newDescription || 'مورد مشترك جديد في منصة NexusAI',
      content: newContent,
      tags: newTags ? newTags.split(',').map(t => t.trim()) : ['General'],
      sizeKb: Math.max(1, Math.round(newContent.length / 1024)),
      author: 'المستخدم الحالي',
    });

    setNewTitle('');
    setNewDescription('');
    setNewContent('');
    setNewTags('');
    setIsAdding(false);
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All Assets' },
    { id: 'prompt', labelAr: 'أوامر وبرومبتس (Prompts)', labelEn: 'Prompts' },
    { id: 'code', labelAr: 'أكواد ومكتبات (Code)', labelEn: 'Code Snippets' },
    { id: 'doc', labelAr: 'مستندات ومعايير (Docs)', labelEn: 'Docs & Specs' },
    { id: 'system', labelAr: 'توجيهات النظام (System)', labelEn: 'System Cards' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderGit2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {language === 'ar' ? 'المكتبة السحابية المشتركة بين الأدوات' : 'Shared Cloud Asset Library'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar'
              ? 'مستودع مركزي للقوالب البرمجية، وهندسة الأوامر، والمستندات المشتركة بين كافة النماذج.'
              : 'Store, reuse, and inject prompt templates, datasets, and code across all models seamlessly.'}
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة مورد جديد' : 'Add New Resource'}</span>
        </button>
      </div>

      {/* Add New Resource Modal / Card */}
      {isAdding && (
        <form onSubmit={handleCreateAsset} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{language === 'ar' ? 'إضافة مورد جديد للمكتبة المشتركة' : 'Create New Shared Asset'}</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'ar' ? 'عنوان المورد:' : 'Title:'}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="مثال: برومبت استخراج وتحليل ملفات الـ PDF"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'ar' ? 'التصنيف:' : 'Category:'}
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="prompt">أمر وبرومبت (Prompt)</option>
                <option value="code">كود برمجي (Code)</option>
                <option value="doc">مستند ومعيار (Document)</option>
                <option value="system">تعليمات النظام (System Card)</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'ar' ? 'الوصف الموجز:' : 'Description:'}
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="وصف مختصر لمجال استخدام هذا المورد..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'ar' ? 'محتوى المورد (نص البرومبت أو الكود):' : 'Resource Content:'}
            </label>
            <textarea
              required
              rows={4}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="اكتب أو الصق نص البرومبت أو الشيفرة البرمجية هنا..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {language === 'ar' ? 'حفظ في المكتبة' : 'Save to Library'}
            </button>
          </div>
        </form>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute start-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في الموارد، البرومبتات، والوسوم...' : 'Search resources, tags, prompts...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {language === 'ar' ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>

      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => {
          return (
            <div
              key={asset.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-md transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                    {asset.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {asset.sizeKb} KB
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {asset.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {asset.description}
                </p>

                {/* Content preview snippet */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-600 dark:text-slate-400 max-h-20 overflow-y-auto mb-3">
                  {asset.content}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {asset.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                
                <button
                  onClick={() => handleUseInStudio(asset.content)}
                  className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إدراج بالاستوديو' : 'Insert to Studio'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(asset.id, asset.content)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={language === 'ar' ? 'نسخ' : 'Copy'}
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title={language === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
