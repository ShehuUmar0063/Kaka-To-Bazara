import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
  body: unknown;
}

export interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

export type SupportedLanguage = 'en' | 'ha' | 'ff' | 'pcm';

export interface AdvisorContext {
  language: SupportedLanguage;
  simpleMode: boolean;
  lgaName: string;
  exactPlaceName?: string;
  terrain: string;
  lat: number;
  lon: number;
  elevationM?: number;
  terrainLabel?: string;
  farmSizeHa?: number;
  soilKindLabel?: string;
  plannedCropLabel?: string;
  soilWetnessPct: number;
  viableDays: number;
  verdict: string;
  dataSource: 'live' | 'cached';
}

export interface AnalyzeRequestBody {
  language: SupportedLanguage;
  lgaName: string;
  exactPlaceName?: string;
  lat: number;
  lon: number;
  elevationM: number;
  terrainLabel: string;
  farmSizeHa: number;
  soilKindLabel: string;
  plannedCropLabel: string;
  soilWetnessPct: number;
  viableDays: number;
  dailyLossMm: number;
  maxTempC: number;
  totalRainMm: number;
  dataSource: 'live' | 'cached';
}

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export const LANGUAGE_DIRECTIVES: Record<SupportedLanguage, string> = {
  en: 'Reply strictly in clear, short, everyday English tailored to Gombe State farmers.',
  ha: 'Reply strictly in natural Northern Nigerian Hausa using authentic farming words like Kaka (harvest), Bazara (dry season), Damshin Kasa (soil moisture), Wake (cowpea), Masara (maize), Dawa (sorghum), Gyada (groundnut), Gero (millet), Shinkafa (rice), and Fadama (lowland). Keep answers warm and easy to follow.',
  ff: 'Reply strictly in natural Gombe/Adamawa Fulfulde using authentic farming and pastoral words like Nduungu (rainy season), Ceedu (dry season), Ndiyam Leydi (soil moisture), Nyebbe (cowpea), Bayeeri (sorghum), Butaali (maize), and Muuri (millet). Keep answers warm and concise.',
  pcm: 'Reply strictly in clear, everyday Nigerian Pidgin used by farmers and extension workers in Gombe State. Keep answers short, warm, and practical.',
};

export function createGeminiClient(apiKey: string) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function extractCleanError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : fallback;
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string } };
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // raw is plain text
  }
  return raw || fallback;
}

export async function withGeminiRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : '';
      const isTransient = msg.includes('503') || msg.includes('429') || msg.includes('UNAVAILABLE');
      if (!isTransient || i === attempts - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 700 * (i + 1)));
    }
  }
  throw lastError;
}

export function buildAdvisorInstruction(ctx: AdvisorContext): string {
  const simplicityRule = ctx.simpleMode
    ? 'Simple Mode is ON: do not use scientific acronyms like GWETROOT, EVPTRNS, NDVI, or SMAP. Use plain words like deep soil water, sun drying, and satellite check.'
    : 'Keep explanations clear and concise; avoid heavy jargon and always tie insights back to practical farm steps.';

  return [
    'You are a practical Gombe State Agricultural Extension AI Assistant (do not adopt any personal character name).',
    LANGUAGE_DIRECTIVES[ctx.language],
    simplicityRule,
    '',
    'Current Farmer Plot & Live NASA + SRTM Data:',
    `- Nearest LGA: ${ctx.lgaName} (${ctx.terrain})`,
    ...(ctx.exactPlaceName ? [`- Exact Tapped Place: ${ctx.exactPlaceName}`] : []),
    `- Exact Farm Pin: Lat ${ctx.lat.toFixed(4)}, Lon ${ctx.lon.toFixed(4)}`,
    `- Farm Size: ${ctx.farmSizeHa ?? 1} Hectares`,
    `- Sand / Soil Type: ${ctx.soilKindLabel ?? 'Mixed Loamy Soil'}`,
    `- Planned Crop: ${ctx.plannedCropLabel ?? '60-Day Cowpea / Beans'}`,
    `- SRTM 30m Elevation: ${ctx.elevationM ?? 300}m (${ctx.terrainLabel ?? ctx.terrain})`,
    `- Soil Wetness: ${ctx.soilWetnessPct.toFixed(0)}%`,
    `- Estimated Soil Water Left: ${ctx.viableDays} days`,
    `- Current Verdict: ${ctx.verdict}`,
    `- Source: ${ctx.dataSource === 'live' ? 'NASA POWER Live Data' : 'NASA Gombe Baseline'}`,
    '',
    'Response Guidelines:',
    '1. Keep your reply concise (3 to 4 short sentences or 3 crisp bullet points) so it reads cleanly on a mobile screen.',
    '2. Give practical advice suited to this exact coordinate, farm size, sand/soil type, and planned crop.',
    '3. End with a short reminder to check actual soil moisture by hand on the plot and test seed quality before planting.',
  ].join('\n');
}

export { ThinkingLevel, Type };
