import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TranslationPack } from '../data/translations';
import type { NasaDailyPoint } from '../types/farm';

interface SoilWaterChartProps {
  points: NasaDailyPoint[];
  t: TranslationPack;
  simpleMode: boolean;
  isLoading: boolean;
}

export function SoilWaterChart({ points, t, simpleMode, isLoading }: SoilWaterChartProps) {
  const title = simpleMode ? t.chartTitleSimple : t.chartTitleTech;
  const legendLabel = simpleMode ? t.chartLegendSimple : t.chartLegendTech;

  return (
    <section
      aria-labelledby="soil-chart-title"
      className="bg-white border border-[#E5E0D5] rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 id="soil-chart-title" className="text-base sm:text-lg font-semibold text-[#1C241F]">
          {title}
        </h2>
        <span className="text-xs font-mono text-[#525E56] shrink-0">{legendLabel}</span>
      </div>

      {isLoading ? (
        <div className="h-[220px] sm:h-[260px] w-full rounded-xl bg-[#FAF8F5] flex items-center justify-center text-sm text-[#525E56]">
          {t.loadingLabel}
        </div>
      ) : (
        <div className="h-[220px] sm:h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="soilWaterFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4332" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#1B4332" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFECE4" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#525E56', fontFamily: 'IBM Plex Mono, monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E0D5' }}
                minTickGap={34}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[25, 50, 75, 100]}
                tick={{ fontSize: 11, fill: '#525E56', fontFamily: 'IBM Plex Mono, monospace' }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E0D5',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}
                labelStyle={{ fontWeight: 600, color: '#1B4332', marginBottom: '2px' }}
                formatter={(value: unknown) => [`${Math.round(Number(value))}%`, legendLabel]}
              />
              <Area
                type="monotone"
                dataKey="gwetrootPct"
                stroke="#1B4332"
                strokeWidth={2.5}
                fill="url(#soilWaterFill)"
                activeDot={{ r: 5, fill: '#1B4332', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
