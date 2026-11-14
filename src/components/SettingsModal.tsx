import { X, Check } from 'lucide-react';
import type { TranslationPack } from '../data/translations';
import type { Language } from '../types/farm';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationPack;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  simpleMode: boolean;
  onToggleSimpleMode: () => void;
}

const LANGUAGE_OPTIONS: Array<{ id: Language; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'ha', label: 'Hausa' },
  { id: 'ff', label: 'Fulfulde' },
  { id: 'pcm', label: 'Pidgin' },
];

export function SettingsModal({
  isOpen,
  onClose,
  t,
  language,
  onSelectLanguage,
  simpleMode,
  onToggleSimpleMode,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C241F]/40 backdrop-blur-[2px] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E5E0D5] p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="settings-modal-title" className="text-lg font-semibold text-[#1C241F]">
            {t.settingsTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeLabel}
            className="min-h-[44px] min-w-[44px] -mr-2 rounded-full flex items-center justify-center text-[#525E56] hover:bg-[#FAF8F5] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-[#525E56]">{t.languageLabel}</div>
          <div className="grid grid-cols-2 gap-2.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = language === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectLanguage(opt.id)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                    active
                      ? 'bg-[#1B4332] text-white border-[#1B4332]'
                      : 'bg-[#FAF8F5] text-[#1C241F] border-[#E5E0D5] hover:border-[#1B4332]/50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Simple Mode Toggle */}
        <div className="pt-2 border-t border-[#EFECE4]">
          <button
            type="button"
            role="switch"
            aria-checked={simpleMode}
            onClick={onToggleSimpleMode}
            className="w-full min-h-[56px] flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            <div>
              <div className="text-sm font-semibold text-[#1C241F]">{t.simpleModeLabel}</div>
              <div className="text-xs text-[#525E56] mt-0.5">{t.simpleModeHint}</div>
            </div>
            <span
              className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center ${
                simpleMode ? 'bg-[#1B4332] justify-end' : 'bg-[#D8D1C5] justify-start'
              }`}
              aria-hidden="true"
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[48px] rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#143326] transition-colors cursor-pointer"
        >
          {t.doneLabel}
        </button>
      </div>
    </div>
  );
}
