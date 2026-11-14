import { X, Satellite, Globe2 } from 'lucide-react';
import type { TranslationPack } from '../data/translations';

interface NasaSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationPack;
  simpleMode: boolean;
}

export function NasaSourcesModal({ isOpen, onClose, t, simpleMode }: NasaSourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C241F]/40 backdrop-blur-[2px] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nasa-sources-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E5E0D5] p-6 space-y-4 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Satellite className="w-5 h-5 text-[#1B4332] shrink-0" aria-hidden="true" />
            <h2 id="nasa-sources-title" className="text-lg font-semibold text-[#1C241F]">
              {t.nasaPopupTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeLabel}
            className="min-h-[44px] min-w-[44px] -mr-2 rounded-full flex items-center justify-center text-[#525E56] hover:bg-[#FAF8F5] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="space-y-2.5 text-sm leading-relaxed">
          {t.nasaSourcesList.map((src) => (
            <li key={src.name} className="p-3 rounded-xl bg-[#FAF8F5]">
              <div className="text-xs font-semibold text-[#1B4332]">{src.name}</div>
              <div className="text-xs sm:text-sm text-[#2D3831] mt-0.5">
                {simpleMode ? src.detailSimple : src.detailTech}
              </div>
            </li>
          ))}
        </ul>

        <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9A3412]">
            <Globe2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.nasaGlobalNoteTitle}</span>
          </div>
          <p className="text-xs text-[#78350F] leading-relaxed">{t.nasaGlobalNoteBody}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[48px] rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#143326] transition-colors cursor-pointer"
        >
          {t.closeLabel}
        </button>
      </div>
    </div>
  );
}
