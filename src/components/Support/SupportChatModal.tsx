import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Headphones, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupportChatModal: React.FC = () => {
  const { language, isSupportModalOpen, setIsSupportModalOpen } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: language === 'ar'
        ? 'مرحباً بك في الدعم الفني المباشر لـ NexusAI! أنا مساعدك الذكي المتاح 24/7 لمساعدتك في استكشاف النماذج، ميزات الترحيل بين النماذج، إدارة الإصدارات، أو إعداد التخزين السحابي والتشفير.'
        : 'Welcome to NexusAI 24/7 Live Support! How can I assist you with model hand-offs, VCS snapshots, or integrations today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isSupportModalOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { role: 'user', text: userText, time: currentTime }]);
    setInput('');
    setIsTyping(true);

    // Call server or simulate instantaneous expert response
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('ترحيل') || lower.includes('handoff') || lower.includes('متابعة')) {
        reply = language === 'ar'
          ? 'ميزة الترحيل (Cross-Model Hand-off) تتيح لك الضغط على زر "ترحيل إلى نموذج آخر" تحت أي رد في الاستوديو. يتم نقل الذاكرة وسياق التوقف تلقائياً للنموذج المستهدف دون أي فقدان للبيانات!'
          : 'Cross-Model Hand-off allows you to click "Hand off to Model" on any response. Active tokens and stopping context are seamlessly bridged to the next engine!';
      } else if (lower.includes('مجاني') || lower.includes('free') || lower.includes('تكلفة') || lower.includes('cost')) {
        reply = language === 'ar'
          ? 'كافة النماذج المتاحة في المنصة (DeepSeek-R1, Llama 3.3, Qwen 2.5 Coder, FLUX.1 Schnell, Whisper) مجانية بالكامل ومفتوحة الأوزان، بدون أي رسوم خفية.'
          : 'All models in NexusAI (DeepSeek, Llama 3.3, Qwen Coder, FLUX, Whisper) are completely free with zero subscription costs.';
      } else if (lower.includes('إصدار') || lower.includes('vcs') || lower.includes('diff') || lower.includes('حفظ')) {
        reply = language === 'ar'
          ? 'نظام الإصدارات المركزي يقوم بحفظ نقاط زمنية (Commits) تلقائياً عند كل ترحيل أو يدوياً. يمكنك في أي وقت استعراض الفروقات (Visual Diff) أو استرجاع أي إصدار بضغطة زر.'
          : 'Our Central VCS records snapshots automatically during hand-offs. You can inspect visual diffs and perform 1-click rollbacks anytime.';
      } else {
        reply = language === 'ar'
          ? 'شكراً لتواصلك! يعمل نظام NexusAI بتكامل تام بين التخزين السحابي ووضع عدم الاتصال والتشفير المتقدم AES-256. هل تحتاج إلى مساعدة إضافية في إعداد محدد؟'
          : 'Thank you for reaching out! NexusAI provides unified multi-model execution, offline sync, and AES-256 encryption. Let me know if you need assistance configuring any specific tool.';
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 600);
  };

  const quickQuestions = [
    { ar: 'كيف أرحّل العمل من DeepSeek إلى Qwen؟', en: 'How does hand-off work?' },
    { ar: 'هل النماذج مجانية تماماً؟', en: 'Are all models free?' },
    { ar: 'كيف يعمل التزامن عند انقطاع الإنترنت؟', en: 'How does offline sync work?' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[560px]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm">
                  {language === 'ar' ? 'الدعم الفني المباشر 24/7' : 'NexusAI 24/7 Live Support'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              </div>
              <p className="text-[11px] text-emerald-100">
                {language === 'ar' ? 'متصل الآن • الرد فوري خلال ثوانٍ' : 'Online • Instant AI specialist assistance'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-te-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-ts-xs shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-[120px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(language === 'ar' ? q.ar : q.en)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 shrink-0 transition"
            >
              {language === 'ar' ? q.ar : q.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ar' ? 'اكتب استفسارك للدعم الفني...' : 'Type your question...'}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4 rotate-180 rtl:rotate-0" />
          </button>
        </div>

      </div>
    </div>
  );
};
