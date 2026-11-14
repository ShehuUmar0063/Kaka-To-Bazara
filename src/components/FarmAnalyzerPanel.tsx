import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, Sprout, Layers, Share2, Check } from 'lucide-react';
import type { FarmInputsCopy } from '../data/farmInputsTranslations';
import type { FarmAnalysisResult, PlannedCropId, SoilKindId } from '../types/farm';

export interface FarmShareDetails {
  lgaName: string;
  lat: number;
  lon: number;
  elevationM: number;
  terrainLabel: string;
  farmSizeHa: number;
  soilWetnessPct: number;
  viableDays: number;
  dailyLossMm: number;
  maxTempC: number;
  soilWaterLeftLabel: string;
  daysUnit: string;
  soilWetnessLabel: string;
  soilVerdictText: string;
}

interface FarmAnalyzerPanelProps {
  copy: FarmInputsCopy;
  soilKind: SoilKindId;
  plannedCrop: PlannedCropId;
  onChangeSoilKind: (soil: SoilKindId) => void;
  onChangePlannedCrop: (crop: PlannedCropId) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysis: FarmAnalysisResult | null;
  analysisError: string | null;
  isStale: boolean;
  farmDetails: FarmShareDetails;
}

const SOIL_OPTIONS: SoilKindId[] = ['sandy', 'loamy', 'clay'];
const CROP_OPTIONS: PlannedCropId[] = [
  'maize',
  'cowpea',
  'sorghum',
  'groundnut',
  'millet',
  'rice',
  'vegetables',
];

function buildShareSummaryText(
  copy: FarmInputsCopy,
  analysis: FarmAnalysisResult,
  soilKind: SoilKindId,
  plannedCrop: PlannedCropId,
  details: FarmShareDetails
): string {
  const mapUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${details.lat.toFixed(
    5
  )},${details.lon.toFixed(5)}&zoom=17&basemap=satellite`;

  const altLines = analysis.alternatives.slice(0, 3).map((alt, idx) => {
    return `${idx + 1}. ${alt.cropName} (${alt.tag})\n   - ${copy.prosLabel}: ${alt.pros}\n   - ${copy.risksLabel}: ${alt.risks}`;
  });

  return [
    `Kaka-to-Bazara — ${copy.analysisResultTitle}`,
    '',
    `${copy.shareSummaryVerdict}: ${analysis.verdictBadge}`,
    analysis.why,
    '',
    `${copy.shareSummaryLocation}: ${details.lgaName} (${details.lat.toFixed(5)}°N, ${details.lon.toFixed(5)}°E · ${details.elevationM}m ${details.terrainLabel})`,
    `${copy.shareSummarySize}: ${details.farmSizeHa} ${copy.hectaresUnit}`,
    `${copy.shareSummarySoil}: ${copy.soilKinds[soilKind]}`,
    `${copy.shareSummaryCrop}: ${copy.plannedCrops[plannedCrop]}`,
    '',
    `${copy.shareSummarySoilStatus}:`,
    `• ${details.soilWetnessLabel}: ${details.soilWetnessPct}%`,
    `• ${details.soilWaterLeftLabel}: ${details.viableDays} ${details.daysUnit} (${details.soilVerdictText})`,
    `• ${details.dailyLossMm.toFixed(1)} mm/day · ${details.maxTempC.toFixed(1)}°C`,
    '',
    `${copy.shareSummaryOptions}:`,
    ...altLines,
    '',
    `${copy.shareSummaryMapLink}: ${mapUrl}`,
  ].join('\n');
}

export function FarmAnalyzerPanel({
  copy,
  soilKind,
  plannedCrop,
  onChangeSoilKind,
  onChangePlannedCrop,
  onAnalyze,
  isAnalyzing,
  analysis,
  analysisError,
  isStale,
  farmDetails,
}: FarmAnalyzerPanelProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const markCopied = () => {
    setShareStatus('copied');
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setShareStatus('idle');
    }, 2500);
  };

  const handleShare = async () => {
    if (!analysis) return;

    const title = `Kaka-to-Bazara — ${copy.analysisResultTitle}`;
    const text = buildShareSummaryText(copy, analysis, soilKind, plannedCrop, farmDetails);

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        // Fall through to clipboard fallback if Web Share is blocked (e.g. desktop or iframe)
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        markCopied();
      }
    } catch {
      // Clipboard access unavailable
    }
  };

  return (
    <section aria-label="Farm Inputs and Crop Check" className="space-y-4">
      {/* 2 Simple Farmer Inputs + Prominent Analyze Button */}
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input 1: Kind of Sand / Soil */}
          <div>
            <label htmlFor="soil-kind-select" className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] mb-2">
              <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{copy.soilKindLabel}</span>
            </label>
            <select
              id="soil-kind-select"
              value={soilKind}
              onChange={(e) => onChangeSoilKind(e.target.value as SoilKindId)}
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm font-medium bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl text-[#1C241F] focus:outline-none focus:border-[#1B4332] cursor-pointer"
            >
              {SOIL_OPTIONS.map((id) => (
                <option key={id} value={id}>
                  {copy.soilKinds[id]}
                </option>
              ))}
            </select>
          </div>

          {/* Input 2: What Do You Want to Plant Now? */}
          <div>
            <label htmlFor="planned-crop-select" className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] mb-2">
              <Sprout className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{copy.plannedCropLabel}</span>
            </label>
            <select
              id="planned-crop-select"
              value={plannedCrop}
              onChange={(e) => onChangePlannedCrop(e.target.value as PlannedCropId)}
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm font-medium bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl text-[#1C241F] focus:outline-none focus:border-[#1B4332] cursor-pointer"
            >
              {CROP_OPTIONS.map((id) => (
                <option key={id} value={id}>
                  {copy.plannedCrops[id]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prominent "Check If My Crop Will Work" Button */}
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full min-h-[52px] px-6 py-3 rounded-xl bg-[#1B4332] text-white text-sm sm:text-base font-semibold hover:bg-[#143326] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
        >
          <Sparkles className={`w-5 h-5 shrink-0 ${isAnalyzing ? 'animate-pulse' : ''}`} aria-hidden="true" />
          <span>{isAnalyzing ? copy.analyzingBtnLabel : copy.analyzeBtnLabel}</span>
        </button>

        {analysisError && (
          <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs sm:text-sm text-[#9A3412] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{analysisError}</span>
          </div>
        )}
      </div>

      {/* AI Farm Summary Result Card */}
      {analysis && (
        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 sm:p-6 space-y-5">
          {/* Header + Verdict Badge + Share Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#EFECE4]">
            <div>
              <h3 className="text-base font-semibold text-[#1C241F]">{copy.analysisResultTitle}</h3>
              {isStale && <p className="text-xs text-[#B45309] mt-0.5">{copy.staleHint}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold ${
                  analysis.verdict === 'YES'
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-[#FFFBEB] text-[#9A3412] border border-[#D97706]'
                }`}
              >
                {analysis.verdict === 'YES' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#A7F3D0] shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
                )}
                <span>{analysis.verdictBadge}</span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                aria-label={shareStatus === 'copied' ? copy.copiedBtnLabel : copy.shareBtnLabel}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D1C5] text-xs font-semibold text-[#1B4332] hover:border-[#1B4332] hover:bg-[#1B4332]/5 active:scale-[0.98] transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
              >
                {shareStatus === 'copied' ? (
                  <>
                    <Check className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                    <span className="text-[#15803D]">{copy.copiedBtnLabel}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{copy.shareBtnLabel}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Why (2 Short Plain Sentences) */}
          <p className="text-sm sm:text-base text-[#1C241F] leading-relaxed">{analysis.why}</p>

          {/* 3 Better Rotation Alternatives Cards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#525E56]">{copy.alternativesHeading}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.alternatives.slice(0, 3).map((alt, idx) => (
                <div
                  key={`${alt.cropName}-${idx}`}
                  className={`p-4 rounded-xl flex flex-col justify-between gap-2.5 ${
                    idx === 1
                      ? 'bg-[#F0FDF4] border border-[#BBF7D0]'
                      : 'bg-[#FAF8F5] border border-[#E5E0D5]'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-semibold text-[#1B4332]">{alt.tag}</div>
                    <div className="text-sm font-semibold text-[#1C241F] mt-0.5">{alt.cropName}</div>
                  </div>
                  <div className="space-y-1.5 text-xs leading-snug pt-2 border-t border-black/5">
                    <div className="text-[#1C241F]">
                      <span className="font-semibold text-[#1B4332]">{copy.prosLabel}: </span>
                      {alt.pros}
                    </div>
                    <div className="text-[#525E56]">
                      <span className="font-semibold text-[#B45309]">{copy.risksLabel}: </span>
                      {alt.risks}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
