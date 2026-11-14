import { useState } from 'react';
import { ChevronRight, X, Sprout, Shield, Ban } from 'lucide-react';
import type { TranslationPack } from '../data/translations';
import type { RotationOptionId } from '../types/farm';

interface RotationCardsProps {
  t: TranslationPack;
  simpleMode: boolean;
  isViable: boolean;
}

const OPTION_ORDER: RotationOptionId[] = ['bare', 'cowpea', 'lablab'];

export function RotationCards({ t, simpleMode, isViable }: RotationCardsProps) {
  const [selectedId, setSelectedId] = useState<RotationOptionId | null>(null);

  const selectedCopy = selectedId ? t.options[selectedId] : null;

  return (
    <section aria-labelledby="rotation-options-title" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h2 id="rotation-options-title" className="text-base sm:text-lg font-semibold text-[#1C241F]">
          {t.optionsTitle}
        </h2>
        <p className="text-xs text-[#525E56]">{t.tapDetailsHint}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {OPTION_ORDER.map((id, idx) => {
          const opt = t.options[id];
          const isRecommended = id === 'cowpea' && isViable;
          const isFodderBest = id === 'lablab' && !isViable;
          const highlight = isRecommended || isFodderBest;

          const Icon = id === 'bare' ? Ban : id === 'cowpea' ? Sprout : Shield;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedId(id)}
              className={`text-left rounded-2xl p-4 sm:p-5 bg-white transition-all flex flex-col justify-between gap-3 cursor-pointer active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                highlight
                  ? 'border-2 border-[#1B4332]'
                  : 'border border-[#E5E0D5] hover:border-[#1B4332]/50'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#525E56]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#1B4332]">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>0{idx + 1} · {opt.tag}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#525E56] shrink-0" aria-hidden="true" />
                </div>

                <h3 className="text-base font-semibold text-[#1C241F] leading-snug">
                  {opt.title}
                </h3>
              </div>

              <ul className="space-y-1.5 text-xs text-[#525E56] pt-2 border-t border-[#EFECE4]">
                <li className="font-mono tabular-nums font-medium text-[#1C241F]">
                  • {opt.waterLine}
                </li>
                <li className="text-[11px] font-medium text-[#1B4332]">
                  • {opt.faoGaezBadge}
                </li>
                <li className="leading-snug">• {opt.keyPoint}</li>
              </ul>
            </button>
          );
        })}
      </div>

      {/* Rotation Option Details Modal */}
      {selectedId && selectedCopy && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C241F]/40 backdrop-blur-[2px] p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rotation-modal-title"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E5E0D5] p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-[#1B4332]">
                  {selectedCopy.tag} · {selectedCopy.faoGaezBadge}
                </div>
                <h3 id="rotation-modal-title" className="text-xl font-semibold text-[#1C241F] mt-0.5">
                  {selectedCopy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label={t.closeLabel}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 rounded-full flex items-center justify-center text-[#525E56] hover:bg-[#FAF8F5] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <dl className="space-y-4 text-sm leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5]">
                <dt className="text-xs font-semibold text-[#1B4332]">{t.modalWhyNasa}</dt>
                <dd className="text-[#1C241F] mt-1">
                  {simpleMode ? selectedCopy.whyNasaSimple : selectedCopy.whyNasaTech}
                </dd>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFBEB]">
                <dt className="text-xs font-semibold text-[#B45309]">{t.modalDataGaps}</dt>
                <dd className="text-[#1C241F] mt-1">{selectedCopy.dataGaps}</dd>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5]">
                <dt className="text-xs font-semibold text-[#1C241F]">{t.modalFarmerChecks}</dt>
                <dd className="text-[#525E56] mt-1">{selectedCopy.farmerChecks}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="w-full min-h-[48px] rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#143326] transition-colors cursor-pointer"
            >
              {t.closeLabel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
