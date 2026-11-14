import { Settings, Sprout, ArrowRight } from 'lucide-react';
import type { TranslationPack } from '../data/translations';

interface WelcomeScreenProps {
  t: TranslationPack;
  onStart: () => void;
  onOpenSettings: () => void;
}

export function WelcomeScreen({ t, onStart, onOpenSettings }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C241F] flex flex-col">
      {/* Minimal Top Bar with only Settings Gear Icon in top-right */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t.settingsTitle}
          className="min-h-[44px] min-w-[44px] rounded-full bg-white border border-[#E5E0D5] flex items-center justify-center text-[#1C241F] hover:border-[#1B4332] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </button>
      </header>

      {/* Centered Welcome Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16 text-center">
        <div className="max-w-lg w-full flex flex-col items-center">
          {/* App Logo Emblem */}
          <div className="w-20 h-20 rounded-3xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm mb-6">
            <Sprout className="w-10 h-10" aria-hidden="true" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1C241F] tracking-tight">
            {t.appTitle}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#525E56] leading-relaxed text-balance">
            {t.welcomeIntro}
          </p>

          <button
            type="button"
            onClick={onStart}
            className="mt-8 w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#1B4332] text-white text-base font-semibold hover:bg-[#143326] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
          >
            <span>{t.startExploring}</span>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </main>
    </div>
  );
}
