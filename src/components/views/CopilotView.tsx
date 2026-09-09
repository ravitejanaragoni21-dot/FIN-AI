import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  Sparkles,
  ArrowRight,
  User,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const sampleQuestions = [
  'How much money is pending?',
  'Which customers owe me the most?',
  'Will I have enough cash next month?',
  'Why did my expenses increase?',
  'What are my biggest financial risks?',
  'Show my revenue trend.',
  'Am I ready to apply for financing?'
];

export const CopilotView: React.FC = () => {
  const { copilotMessages, sendCopilotMessage, setIsVoiceModalOpen, setActiveTab } = useFinance();
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;
    sendCopilotMessage(query);
    setInputQuery('');
  };

  const handleActionClick = (actionText: string) => {
    if (actionText.includes('Invoices') || actionText.includes('Reminders')) {
      setActiveTab('payments');
    } else if (actionText.includes('Forecast') || actionText.includes('Revenue')) {
      setActiveTab('cashflow');
    } else if (actionText.includes('Credit')) {
      setActiveTab('credit');
    } else if (actionText.includes('Risk')) {
      setActiveTab('risk');
    } else if (actionText.includes('Passport')) {
      setActiveTab('passport');
    } else {
      handleSend(actionText);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>FIN AI Copilot • Autonomous Financial Assistant</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Financial Conversational Copilot</h1>
        </div>

        {/* Simulated Voice Mic Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Mic className="w-4 h-4" />
          <span>Voice AI (Telugu / Hindi / En)</span>
        </button>
      </div>

      {/* Suggested Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-shrink-0">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Ask Copilot:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
        {copilotMessages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    : 'bg-cyan-500 text-slate-950'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[10px] opacity-60 block mt-2">{msg.timestamp}</span>
                </div>

                {/* Suggested Action Chips from Assistant */}
                {!isUser && msg.suggestedActions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 flex-shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask about revenue, pending payments, loans, risks..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none shadow-xl pr-10"
          />
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
