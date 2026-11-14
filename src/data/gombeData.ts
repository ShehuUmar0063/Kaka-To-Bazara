import type { FarmTelemetry, GombeLga, GombeLgaId, NasaDailyPoint, SoilKindId, TerrainClass } from '../types/farm';

export const SOIL_KIND_CAPACITY_MM: Record<SoilKindId, number> = {
  sandy: 120,
  loamy: 165,
  clay: 210,
};

export const GOMBE_LGAS: GombeLga[] = [
  {
    id: 'yamaltu_deba',
    name: 'Yamaltu-Deba (Dadinkowa)',
    terrain: 'Fadama Lowland',
    lat: 10.32,
    lon: 11.48,
    storageCapacityMm: 210,
    defaultElevationM: 238,
    defaultSoilKind: 'clay',
  },
  {
    id: 'akko',
    name: 'Akko (Kumo)',
    terrain: 'Upland',
    lat: 10.05,
    lon: 11.22,
    storageCapacityMm: 120,
    defaultElevationM: 412,
    defaultSoilKind: 'sandy',
  },
  {
    id: 'balanga',
    name: 'Balanga (Tallase)',
    terrain: 'Valley',
    lat: 9.96,
    lon: 11.68,
    storageCapacityMm: 175,
    defaultElevationM: 315,
    defaultSoilKind: 'loamy',
  },
  {
    id: 'billiri',
    name: 'Billiri',
    terrain: 'Hill/Plain',
    lat: 9.86,
    lon: 11.22,
    storageCapacityMm: 150,
    defaultElevationM: 425,
    defaultSoilKind: 'loamy',
  },
  {
    id: 'dukku',
    name: 'Dukku',
    terrain: 'Northern Savanna',
    lat: 10.82,
    lon: 10.77,
    storageCapacityMm: 115,
    defaultElevationM: 398,
    defaultSoilKind: 'sandy',
  },
  {
    id: 'funakaye',
    name: 'Funakaye (Bajoga)',
    terrain: 'Gongola Basin',
    lat: 10.85,
    lon: 11.43,
    storageCapacityMm: 165,
    defaultElevationM: 254,
    defaultSoilKind: 'clay',
  },
  {
    id: 'gombe',
    name: 'Gombe (Capital)',
    terrain: 'Central Plain',
    lat: 10.29,
    lon: 11.17,
    storageCapacityMm: 145,
    defaultElevationM: 446,
    defaultSoilKind: 'loamy',
  },
  {
    id: 'kaltungo',
    name: 'Kaltungo',
    terrain: 'Southern Valley',
    lat: 9.82,
    lon: 11.31,
    storageCapacityMm: 175,
    defaultElevationM: 368,
    defaultSoilKind: 'loamy',
  },
  {
    id: 'kwami',
    name: 'Kwami (Mallam Sidi)',
    terrain: 'Savanna',
    lat: 10.48,
    lon: 11.25,
    storageCapacityMm: 130,
    defaultElevationM: 392,
    defaultSoilKind: 'sandy',
  },
  {
    id: 'nafada',
    name: 'Nafada',
    terrain: 'Northern River Basin',
    lat: 11.09,
    lon: 11.33,
    storageCapacityMm: 120,
    defaultElevationM: 258,
    defaultSoilKind: 'sandy',
  },
  {
    id: 'shongom',
    name: 'Shongom (Boh)',
    terrain: 'Southern Upland',
    lat: 9.68,
    lon: 11.16,
    storageCapacityMm: 155,
    defaultElevationM: 418,
    defaultSoilKind: 'loamy',
  },
];

export function getLgaById(id: GombeLgaId): GombeLga {
  return GOMBE_LGAS.find((l) => l.id === id) ?? GOMBE_LGAS[0];
}

export function classifyElevationTerrain(elevationM: number): TerrainClass {
  if (elevationM < 285) return 'lowland';
  if (elevationM <= 375) return 'valley';
  return 'upland';
}

export function adjustCapacityForElevation(baseCapacityMm: number, elevationM: number): number {
  const terrain = classifyElevationTerrain(elevationM);
  if (terrain === 'lowland') {
    return Math.min(225, Math.round(baseCapacityMm * 1.1));
  }
  if (terrain === 'upland') {
    return Math.max(105, Math.round(baseCapacityMm * 0.9));
  }
  return baseCapacityMm;
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatNasaDate(yyyymmdd: string): { iso: string; label: string } {
  const y = yyyymmdd.slice(0, 4);
  const m = Number(yyyymmdd.slice(4, 6));
  const d = yyyymmdd.slice(6, 8);
  const monthLabel = MONTH_SHORT[Math.max(0, m - 1)] ?? 'Sep';
  return {
    iso: `${y}-${yyyymmdd.slice(4, 6)}-${d}`,
    label: `${monthLabel} ${Number(d)}`,
  };
}

export function computeTelemetrySummary(
  points: NasaDailyPoint[],
  baseCapacityMm: number,
  elevationM: number,
  source: 'live' | 'cached'
): FarmTelemetry {
  const recent = points.slice(-14);
  const latest = points[points.length - 1];

  const avgEvapMm = recent.reduce((sum, p) => sum + p.evptrnsMm, 0) / Math.max(1, recent.length);
  const avgTmaxC = recent.reduce((sum, p) => sum + p.t2mMaxC, 0) / Math.max(1, recent.length);

  const heatDemandMm = 2.0 + Math.max(0, avgTmaxC - 31) * 0.28;
  const effectiveDailyLossMm = Math.max(avgEvapMm, heatDemandMm);

  const adjustedCapacityMm = adjustCapacityForElevation(baseCapacityMm, elevationM);
  const usableFraction = Math.min(1.0, Math.max(0.08, (latest.gwetrootPct - 22) / 48));
  const availableMoistureMm = adjustedCapacityMm * usableFraction;

  const viableDays = Math.max(6, Math.round(availableMoistureMm / effectiveDailyLossMm));
  const isViable = viableDays >= 50;
  const totalRainMm = Number(points.reduce((sum, p) => sum + p.prectotMm, 0).toFixed(1));

  return {
    points,
    latestGwetrootPct: Math.round(latest.gwetrootPct),
    viableDays,
    isViable,
    source,
    adjustedCapacityMm,
    recentAvgLossMm: Number(effectiveDailyLossMm.toFixed(2)),
    latestTempMaxC: latest.t2mMaxC,
    totalRainMm,
  };
}

export function parseNasaPowerPayload(
  payload: unknown,
  baseCapacityMm: number,
  elevationM: number
): FarmTelemetry | null {
  try {
    const root = payload as {
      properties?: {
        parameter?: {
          PRECTOTCORR?: Record<string, number>;
          T2M_MAX?: Record<string, number>;
          GWETROOT?: Record<string, number>;
          EVPTRNS?: Record<string, number>;
        };
      };
    };

    const params = root?.properties?.parameter;
    if (!params?.GWETROOT || !params.T2M_MAX || !params.PRECTOTCORR || !params.EVPTRNS) {
      return null;
    }

    const dates = Object.keys(params.GWETROOT).sort();
    const points: NasaDailyPoint[] = [];

    for (const rawDate of dates) {
      const gwet = params.GWETROOT[rawDate];
      const tMax = params.T2M_MAX[rawDate];
      const precip = params.PRECTOTCORR[rawDate];
      const evapRaw = params.EVPTRNS[rawDate];

      if (
        gwet === undefined || gwet <= -900 ||
        tMax === undefined || tMax <= -900 ||
        precip === undefined || precip <= -900 ||
        evapRaw === undefined || evapRaw <= -900
      ) {
        continue;
      }

      const { iso, label } = formatNasaDate(rawDate);
      const gwetrootPct = Number((gwet <= 1.05 ? gwet * 100 : gwet).toFixed(1));
      const evptrnsMm = Number(Math.max(0.4, evapRaw / 2.45).toFixed(2));

      points.push({
        date: iso,
        label,
        gwetrootPct: Math.min(100, Math.max(0, gwetrootPct)),
        prectotMm: Number(Math.max(0, precip).toFixed(1)),
        t2mMaxC: Number(tMax.toFixed(1)),
        evptrnsMm,
      });
    }

    if (points.length < 10) return null;
    return computeTelemetrySummary(points, baseCapacityMm, elevationM, 'live');
  } catch {
    return null;
  }
}

export function buildBaselineTelemetry(
  lga: GombeLga,
  elevationM?: number,
  overrideCapacityMm?: number
): FarmTelemetry {
  const start = new Date(Date.UTC(2025, 8, 1));
  const isNorthernDry = lga.id === 'dukku' || lga.id === 'nafada' || lga.id === 'kwami';
  const isFadamaOrValley =
    lga.id === 'yamaltu_deba' || lga.id === 'balanga' || lga.id === 'kaltungo' || lga.id === 'funakaye';

  let wetness = isFadamaOrValley ? 82 : isNorthernDry ? 66 : 74;
  const decayStep = isFadamaOrValley ? 0.34 : isNorthernDry ? 0.45 : 0.38;
  const baseTemp = isNorthernDry ? 35.4 : 32.1;

  const points: NasaDailyPoint[] = [];

  for (let i = 0; i < 71; i++) {
    const dt = new Date(start.getTime() + i * 86400000);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dt.getUTCDate()).padStart(2, '0');
    const { iso, label } = formatNasaDate(`${y}${m}${d}`);

    const wave = Math.sin((i + lga.lat) * 0.6);
    let rain = 0;
    if (i < 25) {
      rain = i % 3 === 0 ? Math.max(0, Number((12 + wave * 9).toFixed(1))) : 0;
    } else if (i < 38 && !isNorthernDry) {
      rain = i % 6 === 0 ? 6.2 : 0;
    }

    const recharge = rain * (isFadamaOrValley ? 0.4 : 0.25);
    wetness = Math.max(25, Math.min(90, wetness + recharge - (i < 24 ? decayStep * 0.45 : decayStep)));
    const t2mMaxC = Number((baseTemp + (i > 35 ? (i - 35) * 0.08 : 0) + wave * 0.8).toFixed(1));
    const evptrnsMm = Number((isNorthernDry ? 1.1 : 2.15 + wave * 0.25).toFixed(2));

    points.push({
      date: iso,
      label,
      gwetrootPct: Number(wetness.toFixed(1)),
      prectotMm: rain,
      t2mMaxC,
      evptrnsMm,
    });
  }

  return computeTelemetrySummary(
    points,
    overrideCapacityMm ?? lga.storageCapacityMm,
    elevationM ?? lga.defaultElevationM,
    'cached'
  );
}
