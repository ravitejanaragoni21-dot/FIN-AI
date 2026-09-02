import React, { useState } from 'react';
import { Mic, X, Volume2, Sparkles, Check, Play } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface SampleVoicePrompt {
  lang: 'English' | 'Telugu (తెలుగు)' | 'Hindi (हिंदी)';
  text: string;
  translatedQuery: string;
}

const sampleVoicePrompts: SampleVoicePrompt[] = [
  {
    lang: 'English',
    text: '“Will I have enough cash next month?”',
    translatedQuery: 'Will I have enough cash next month?'
  },
  {
    lang: 'Telugu (తెలుగు)',
    text: '“వచ్చే నెల నా వ్యాపారంలో తగినంత నగదు ఉంటుందా?”',
    translatedQuery: 'Will I have enough cash next month?'
  },
  {
    lang: 'Hindi (हिंदी)',
    text: '“क्या अगले महीने मेरे व्यापार में पर्याप्त नकदी होगी?”',
    translatedQuery: 'Will I have enough cash next month?'
  },
  {
    lang: 'English',
    text: '“Which customers owe me the most money?”',
    translatedQuery: 'Which customers owe me the most?'
  },
  {
    lang: 'Telugu (తెలుగు)',
    text: '“ఏ వినియోగదారులు నాకు ఎక్కువ బకాయి పడ్డారు?”',
    translatedQuery: 'Which customers owe me the most?'
  },
  {
    lang: 'Hindi (हिंदी)',
    text: '“कौन से ग्राहक सबसे ज्यादा बकाया राशि रखते हैं?”',
    translatedQuery: 'Which customers owe me the most?'
  }
];

export const VoiceModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, sendCopilotMessage, setActiveTab } = useFinance();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<'All' | 'English' | 'Telugu' | 'Hindi'>('All');
  const [transcribingText, setTranscribingText] = useState<string>('');

  if (!isVoiceModalOpen) return null;

  const handleSimulatedMicClick = (prompt?: SampleVoicePrompt) => {
    setIsListening(true);
    const query = prompt ? prompt.translatedQuery : 'Will I have enough cash next month?';
    const displayText = prompt ? prompt.text : '“Will I have enough cash next month?”';
    setTranscribingText(displayText);

    setTimeout(() => {
      setIsListening(false);
      setIsVoiceModalOpen(false);
      setActiveTab('copilot');
      sendCopilotMessage(query);
      setTranscribingText('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-100">
              Indian Language Voice Assistant
            </span>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pulsing Mic Visualizer */}
        <div className="flex flex-col items-center justify-center py-4">
          <button
            onClick={() => handleSimulatedMicClick()}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-500 shadow-2xl shadow-rose-500/50 scale-110 animate-pulse'
                : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-xl shadow-cyan-500/30 hover:scale-105'
            }`}
          >
            <Mic className="w-10 h-10 text-slate-950" />
            {isListening && (
              <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-75" />
            )}
          </button>

          <p className="text-sm font-bold text-white mt-4">
            {isListening ? 'Listening & Transcribing...' : 'Tap Mic or Select Sample Voice Query'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports <strong className="text-cyan-400">English</strong>, <strong className="text-cyan-400">Telugu (తెలుగు)</strong>, and <strong className="text-cyan-400">Hindi (हिंदी)</strong>
          </p>

          {transcribingText && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-cyan-300 font-semibold animate-in fade-in">
              {transcribingText}
            </div>
          )}
        </div>

        {/* Sample Voice Queries in Indian Languages */}
        <div className="text-left space-y-2 pt-2 border-t border-slate-800">
          <p className="text-[11px] uppercase font-bold text-slate-400">
            Simulate Voice Prompts:
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {sampleVoicePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulatedMicClick(prompt)}
                className="w-full p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {prompt.lang}
                  </span>
                  <p className="font-semibold text-slate-200 mt-1">{prompt.text}</p>
                </div>
                <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
