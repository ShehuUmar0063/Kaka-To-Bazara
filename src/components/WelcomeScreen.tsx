import { Settings, ArrowRight, MapPin, Droplets, Sparkles } from 'lucide-react';
import type { TranslationPack } from '../data/translations';

interface WelcomeScreenProps {
  t: TranslationPack;
  onStart: () => void;
  onOpenSettings: () => void;
}

const STEP_ICONS = [MapPin, Droplets, Sparkles] as const;

export function WelcomeScreen({ t, onStart, onOpenSettings }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C241F] flex flex-col">
      {/* Top Bar with Settings Gear Icon in Top-Right */}
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

      {/* Hero Section + 3-Step 'How It Works' Guide */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-16 flex flex-col items-center justify-center space-y-12">
        {/* 1. Hero Section (Top Center) */}
        <section className="max-w-2xl w-full flex flex-col items-center text-center">
          {/* App Brand Emblem (matches public/favicon.svg) */}
          <div className="w-20 h-20 rounded-3xl bg-[#1B4332] shadow-sm mb-5 flex items-center justify-center p-2.5">
            <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" aria-hidden="true">
              <path
                d="M12 30a20 20 0 0 1 40 0"
                stroke="#FBBF24"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M30 41C30 27 39 19 49 20C48 33 40 42 30 41Z"
                fill="#4ADE80"
              />
              <path
                d="M30 43C30 33 22 26 14 27C15 37 22 44 30 43Z"
                fill="#22C55E"
              />
              <path
                d="M30 52V32"
                stroke="#FAF8F5"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M47 36C47 36 53.5 43.2 53.5 47.5C53.5 51.09 50.59 54 47 54C43.41 54 40.5 51.09 40.5 47.5C40.5 43.2 47 36 47 36Z"
                fill="#38BDF8"
                stroke="#1B4332"
                strokeWidth="2"
              />
              <circle cx="45" cy="48" r="1.5" fill="#E0F2FE" />
            </svg>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#1C241F] tracking-tight">
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
        </section>

        {/* 2. Simple 'How It Works' 3-Step Guide */}
        <section aria-labelledby="how-it-works-heading" className="w-full space-y-4">
          <h2
            id="how-it-works-heading"
            className="text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#525E56]"
          >
            {t.howItWorksTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.howItWorksSteps.map((step, idx) => {
              const Icon = STEP_ICONS[idx] ?? Sparkles;
              return (
                <div
                  key={step.stepLabel}
                  className="bg-white border border-[#E5E0D5] rounded-2xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#1B4332]">{step.stepLabel}</span>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] flex items-center justify-center text-[#1B4332]">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#1C241F] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#525E56] leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
