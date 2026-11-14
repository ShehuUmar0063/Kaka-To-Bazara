import { CheckCircle2, AlertTriangle, Mountain } from 'lucide-react';
import type { TranslationPack } from '../data/translations';
import type { FarmTelemetry, TerrainClass } from '../types/farm';

interface WaterStatusCardProps {
  telemetry: FarmTelemetry;
  elevationM: number;
  terrainClass: TerrainClass;
  t: TranslationPack;
  isLoading: boolean;
}

export function WaterStatusCard({
  telemetry,
  elevationM,
  terrainClass,
  t,
  isLoading,
}: WaterStatusCardProps) {
  const isGood = telemetry.isViable;

  return (
    <section
      aria-label="Soil Water Status"
      className={`rounded-2xl p-5 sm:p-6 border transition-colors ${
        isGood
          ? 'bg-[#1B4332] text-white border-[#1B4332]'
          : 'bg-[#FFFBEB] text-[#1C241F] border-[#D97706]'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-center">
        {/* 1. Soil Water Left */}
        <div>
          <div className={`text-xs font-medium ${isGood ? 'text-[#D8E8DF]' : 'text-[#9A3412]'}`}>
            {t.soilWaterLeftLabel}
          </div>
          <div className="mt-1 text-3xl sm:text-4xl font-mono tabular-nums font-bold tracking-tight">
            {isLoading ? '—' : `${telemetry.viableDays} ${t.daysUnit}`}
          </div>
        </div>

        {/* 2. Soil Wetness */}
        <div className="sm:border-l sm:pl-6 border-current/15">
          <div className={`text-xs font-medium ${isGood ? 'text-[#D8E8DF]' : 'text-[#9A3412]'}`}>
            {t.soilWetnessLabel}
          </div>
          <div className="mt-1 text-3xl sm:text-4xl font-mono tabular-nums font-bold tracking-tight">
            {isLoading ? '—' : `${telemetry.latestGwetrootPct}%`}
          </div>
        </div>

        {/* 3. Verdict */}
        <div className="sm:border-l sm:pl-6 border-current/15">
          <div className={`text-xs font-medium ${isGood ? 'text-[#D8E8DF]' : 'text-[#9A3412]'}`}>
            {t.verdictLabel}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            {isGood ? (
              <CheckCircle2 className="w-5 h-5 text-[#A7F3D0] shrink-0" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" aria-hidden="true" />
            )}
            <span
              className={`text-base sm:text-lg font-display font-semibold leading-snug ${
                isGood ? 'text-white' : 'text-[#9A3412]'
              }`}
            >
              {isGood ? t.verdictGood : t.verdictDry}
            </span>
          </div>
        </div>
      </div>

      {/* Clean Terrain Drainage & Retention Strip */}
      <div
        className={`mt-4 pt-3 border-t border-current/15 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs ${
          isGood ? 'text-[#D8E8DF]' : 'text-[#9A3412]'
        }`}
      >
        <Mountain className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="font-mono tabular-nums font-medium">
          {t.elevationLabel}: {elevationM}m — {t.terrainLabels[terrainClass]}
        </span>
        <span aria-hidden="true">·</span>
        <span>
          {t.retentionAdjustedNote} ({telemetry.adjustedCapacityMm}mm)
        </span>
      </div>
    </section>
  );
}
