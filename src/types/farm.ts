export type Language = 'en' | 'ha' | 'ff' | 'pcm';

export type GombeLgaId =
  | 'yamaltu_deba'
  | 'akko'
  | 'balanga'
  | 'billiri'
  | 'dukku'
  | 'funakaye'
  | 'gombe'
  | 'kaltungo'
  | 'kwami'
  | 'nafada'
  | 'shongom';

export type TerrainClass = 'lowland' | 'valley' | 'upland';

export type MapLayerMode = 'aerial' | 'modis' | 'smap';

export type SoilKindId = 'sandy' | 'loamy' | 'clay';

export type PlannedCropId =
  | 'maize'
  | 'cowpea'
  | 'sorghum'
  | 'groundnut'
  | 'millet'
  | 'rice'
  | 'vegetables';

export interface GombeLga {
  id: GombeLgaId;
  name: string;
  terrain: string;
  lat: number;
  lon: number;
  storageCapacityMm: number;
  defaultElevationM: number;
  defaultSoilKind: SoilKindId;
}

export interface NasaDailyPoint {
  date: string;
  label: string;
  gwetrootPct: number;
  prectotMm: number;
  t2mMaxC: number;
  evptrnsMm: number;
}

export interface FarmTelemetry {
  points: NasaDailyPoint[];
  latestGwetrootPct: number;
  viableDays: number;
  isViable: boolean;
  source: 'live' | 'cached';
  adjustedCapacityMm: number;
  recentAvgLossMm: number;
  latestTempMaxC: number;
  totalRainMm: number;
}

export type RotationOptionId = 'bare' | 'cowpea' | 'lablab';

export interface FarmAnalysisAlternative {
  cropName: string;
  tag: string;
  pros: string;
  risks: string;
}

export interface FarmAnalysisResult {
  verdict: 'YES' | 'WARNING';
  verdictBadge: string;
  why: string;
  alternatives: FarmAnalysisAlternative[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  error?: boolean;
}
