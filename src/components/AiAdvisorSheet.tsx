import { useEffect, useRef, useState } from 'react';
import { Send, Volume2, Square, X, AlertCircle, Sparkles } from 'lucide-react';
import type { TranslationPack } from '../data/translations';
import type { ChatMessage } from '../types/farm';

interface AiAdvisorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationPack;
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => void;
  lgaName: string;
  viableDays: number;
}

export function AiAdvisorSheet({
  isOpen,
  onClose,
  t,
  messages,
  isSending,
  onSendMessage,
  lgaName,
  viableDays,
}: AiAdvisorSheetProps) {
  const [input, setInput] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput('');
    onSendMessage(trimmed);
  };

  const handleToggleSpeech = (msg: ChatMessage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (speakingId === msg.id) {
      synth.cancel();
      setSpeakingId(null);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(msg.text);
    utterance.lang = t.speechLang;
    utterance.rate = 0.95;

    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => v.lang.toLowerCase().startsWith(t.speechLang.toLowerCase().slice(0, 2))) ??
      voices.find((v) => v.lang.toLowerCase().includes('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    synth.speak(utterance);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end bg-[#1C241F]/40 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-sheet-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-[82vh] sm:h-[620px] bg-[#FAF8F5] rounded-t-3xl sm:rounded-2xl border border-[#E5E0D5] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Header */}
        <div className="bg-[#1B4332] text-white px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-5 h-5 text-[#A7F3D0] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2 id="ai-sheet-title" className="text-sm font-semibold truncate">
                {t.aiTitle}
              </h2>
              <p className="text-[11px] text-[#D8E8DF] truncate font-mono tabular-nums">
                {lgaName} · {viableDays} {t.daysUnit}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeLabel}
            className="min-h-[44px] min-w-[44px] -mr-2 rounded-full flex items-center justify-center text-white/90 hover:bg-white/15 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSpeaking = speakingId === msg.id;

            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#1B4332] text-white'
                      : msg.error
                        ? 'bg-[#FEF3C7] text-[#9A3412] border border-[#D97706]/40'
                        : 'bg-white text-[#1C241F] border border-[#E5E0D5]'
                  }`}
                >
                  {msg.error && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Error</span>
                    </div>
                  )}
                  {msg.text}
                </div>

                {!isUser && !msg.error && typeof window !== 'undefined' && 'speechSynthesis' in window && (
                  <button
                    type="button"
                    onClick={() => handleToggleSpeech(msg)}
                    className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#1B4332] hover:bg-[#1B4332]/10 rounded-md cursor-pointer"
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3 h-3 fill-current" aria-hidden="true" />
                        <span>{t.aiStopAudio}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.aiReadAloud}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start">
              <div className="bg-white border border-[#E5E0D5] rounded-2xl px-4 py-2.5 text-xs text-[#525E56]">
                {t.aiThinking}
              </div>
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Quick Questions + Input */}
        <div className="p-3.5 bg-white border-t border-[#E5E0D5] space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            {t.quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={isSending}
                onClick={() => onSendMessage(q)}
                className="text-left text-xs px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-[#1C241F] hover:border-[#1B4332] disabled:opacity-50 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.aiPlaceholder}
              disabled={isSending}
              className="flex-1 min-w-0 min-h-[44px] px-3.5 text-sm bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl text-[#1C241F] placeholder:text-[#6B7870] focus:outline-none focus:border-[#1B4332]"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label={t.aiSend}
              className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-[#1B4332] text-white text-sm font-medium hover:bg-[#143326] disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
