import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '1mb' }));

interface AdvisorContext {
  language: 'en' | 'ha' | 'ff' | 'pcm';
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

interface AnalyzeRequestBody {
  language: 'en' | 'ha' | 'ff' | 'pcm';
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

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

const LANGUAGE_DIRECTIVES: Record<AdvisorContext['language'], string> = {
  en: 'Reply strictly in clear, short, everyday English tailored to Gombe State farmers.',
  ha: 'Reply strictly in natural Northern Nigerian Hausa using authentic farming words like Kaka (harvest), Bazara (dry season), Damshin Kasa (soil moisture), Wake (cowpea), Masara (maize), Dawa (sorghum), Gyada (groundnut), Gero (millet), Shinkafa (rice), and Fadama (lowland). Keep answers warm and easy to follow.',
  ff: 'Reply strictly in natural Gombe/Adamawa Fulfulde using authentic farming and pastoral words like Nduungu (rainy season), Ceedu (dry season), Ndiyam Leydi (soil moisture), Nyebbe (cowpea), Bayeeri (sorghum), Butaali (maize), and Muuri (millet). Keep answers warm and concise.',
  pcm: 'Reply strictly in clear, everyday Nigerian Pidgin used by farmers and extension workers in Gombe State. Keep answers short, warm, and practical.',
};

function buildAdvisorInstruction(ctx: AdvisorContext): string {
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

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/nasa-power', async (req: Request, res: Response) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    res.status(400).json({ error: 'Invalid latitude or longitude coordinates.' });
    return;
  }

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M_MAX,GWETROOT,EVPTRNS&community=AG&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}&start=20250901&end=20251110&format=JSON`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const upstream = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (!upstream.ok) {
      res.status(502).json({ error: `NASA POWER returned status ${upstream.status}` });
      return;
    }

    const payload = await upstream.json();
    res.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to reach NASA POWER API';
    res.status(502).json({ error: message });
  }
});

function extractCleanError(err: unknown, fallback: string): string {
  const raw = err instanceof Error ? err.message : fallback;
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string; code?: number } };
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // raw is plain text
  }
  return raw || fallback;
}

async function withGeminiRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
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

app.post('/api/advisor/analyze', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in the server environment. Please check Settings > Secrets.',
    });
    return;
  }

  const body = req.body as Partial<AnalyzeRequestBody>;
  const language = body.language ?? 'en';
  const plannedCropLabel = body.plannedCropLabel ?? '60-Day Cowpea / Beans (Wake)';
  const soilKindLabel = body.soilKindLabel ?? 'Mixed Loamy Soil (Balanced)';
  const farmSizeHa = Number(body.farmSizeHa ?? 1);
  const lat = Number(body.lat ?? 10.32);
  const lon = Number(body.lon ?? 11.48);
  const elevationM = Number(body.elevationM ?? 245);
  const terrainLabel = body.terrainLabel ?? 'Lowland Basin';
  const soilWetnessPct = Number(body.soilWetnessPct ?? 55);
  const viableDays = Number(body.viableDays ?? 55);
  const dailyLossMm = Number(body.dailyLossMm ?? 2.2);
  const maxTempC = Number(body.maxTempC ?? 33);
  const totalRainMm = Number(body.totalRainMm ?? 210);

  const badgeExamples: Record<'en' | 'ha' | 'ff' | 'pcm', { yes: string; warn: string }> = {
    en: { yes: 'YES — Good to Plant', warn: 'WARNING — High Risk of Failure' },
    ha: { yes: 'EH — Za a Iya Shuka', warn: 'GARGADI — Hadarin Bushewa Yana da Yawa' },
    ff: { yes: 'EEY — Ina Moƴƴi Aawde', warn: 'REENTU — Ina Woodi Mbonndi Yoorgol' },
    pcm: { yes: 'YES — Good to Plant', warn: 'WARNING — High Risk Make E Fail' },
  };

  const exactLocationText = body.exactPlaceName
    ? `${body.exactPlaceName} (${body.lgaName ?? 'Gombe'})`
    : body.lgaName ?? 'Gombe';

  const prompt = [
    'Analyze this exact farm plot for planting right now after the rainy season:',
    `- Exact Place & Location: ${exactLocationText} (Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)})`,
    `- Elevation & Slope: ${elevationM}m (${terrainLabel})`,
    `- Farm Size: ${farmSizeHa} Hectares`,
    `- Soil / Sand Kind: ${soilKindLabel}`,
    `- Farmer Wants to Plant: ${plannedCropLabel}`,
    `- Underground Soil Wetness: ${soilWetnessPct}%`,
    `- Estimated Water Left in Soil: ${viableDays} days`,
    `- Daily Sun Drying: ${dailyLossMm.toFixed(1)} mm/day | Peak Heat: ${maxTempC.toFixed(1)}°C | Sept–Nov Rain: ${totalRainMm.toFixed(0)} mm`,
    '',
    'Agronomic Reality Rules:',
    '- Maize (90–110 days), Lowland Rice (110+ days, needs standing water or wet Fadama), and Sorghum (100–120 days) need MUCH more water than dry-season residual moisture unless wetness is very high in deep Fadama clay. If water left is under 75 days for Maize/Sorghum/Rice, verdict MUST be WARNING.',
    '- 60-Day Cowpea (needs ~55+ days / 180mm), Groundnut (needs ~75+ days / 220mm), Millet (needs ~65+ days), and Vegetables/Okra (need regular moisture or Fadama clay) depend tightly on soil type & days left.',
    '- Dual-Purpose Lablab / Fodder (~50+ days / 150mm) or Mulching + Resting / Relay Cowpea are smarter alternatives when moisture is tight.',
    '',
    'Output Requirements:',
    `1. ${LANGUAGE_DIRECTIVES[language]}`,
    '2. Use ZERO complicated scientific words or acronyms (never write GWETROOT, EVPTRNS, NDVI, SRTM, SMAP, or FAO GAEZ). Speak like a helpful neighbor explaining soil water simply.',
    `3. Set "verdict" to "YES" or "WARNING". Set "verdictBadge" to "${badgeExamples[language].yes}" if YES, or "${badgeExamples[language].warn}" if WARNING.`,
    '4. "why" must be EXACTLY 2 short sentences explaining what is happening in the soil at that exact spot for their farm size and soil type.',
    '5. "alternatives" must contain EXACTLY 3 items: the first item is their chosen crop ("Your Choice"), and the other 2 items are smarter crop rotation options for that exact spot (such as 60-Day Cowpea, Dual-Purpose Lablab Fodder, or Mulched Fallow), each with 1 short "pros" line and 1 short "risks" line.',
  ].join('\n');

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await withGeminiRetry(() =>
      ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: {
                type: Type.STRING,
                description: 'Must be either YES or WARNING',
              },
              verdictBadge: {
                type: Type.STRING,
                description: 'Short localized verdict badge text',
              },
              why: {
                type: Type.STRING,
                description: 'Exactly 2 short plain sentences with zero jargon',
              },
              alternatives: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    cropName: { type: Type.STRING },
                    tag: { type: Type.STRING },
                    pros: { type: Type.STRING },
                    risks: { type: Type.STRING },
                  },
                  required: ['cropName', 'tag', 'pros', 'risks'],
                },
              },
            },
            required: ['verdict', 'verdictBadge', 'why', 'alternatives'],
          },
        },
      })
    );

    const rawText = (response.text ?? '{}').trim();
    const parsed = JSON.parse(rawText);
    res.json(parsed);
  } catch (err) {
    const message = extractCleanError(err, 'Failed to analyze farm plot.');
    console.error('Farm analysis error:', err);
    res.status(500).json({ error: message });
  }
});

app.post('/api/advisor/chat', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in the server environment. Please check Settings > Secrets.',
    });
    return;
  }

  const body = req.body as {
    message?: string;
    history?: ChatTurn[];
    context?: AdvisorContext;
  };

  const userMessage = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!userMessage) {
    res.status(400).json({ error: 'Please enter a farming question.' });
    return;
  }

  const context: AdvisorContext = body.context ?? {
    language: 'en',
    simpleMode: true,
    lgaName: 'Yamaltu-Deba (Dadinkowa)',
    terrain: 'Fadama Lowland',
    lat: 10.32,
    lon: 11.48,
    farmSizeHa: 1,
    soilKindLabel: 'Clay / Fadama Soil',
    plannedCropLabel: '60-Day Cowpea / Beans (Wake)',
    soilWetnessPct: 61,
    viableDays: 64,
    verdict: 'Good for 60-Day Cowpea',
    dataSource: 'live',
  };

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const historyTurns: ChatTurn[] = Array.isArray(body.history)
      ? body.history.slice(-8).filter((t) => t && (t.role === 'user' || t.role === 'model') && typeof t.text === 'string')
      : [];

    const response = await withGeminiRetry(async () => {
      const chat = ai.chats.create({
        model: 'gemini-4-hydrogen',
        config: {
          systemInstruction: buildAdvisorInstruction(context),
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
        history: historyTurns.map((turn) => ({
          role: turn.role,
          parts: [{ text: turn.text }],
        })),
      });
      return chat.sendMessage({ message: userMessage });
    });

    const replyText = response.text?.trim();

    if (!replyText) {
      res.status(502).json({ error: 'Received an empty response. Please try again.' });
      return;
    }

    res.json({ reply: replyText });
  } catch (err) {
    const message = extractCleanError(err, 'Failed to reach Gemini AI service.');
    console.error('AI Advisor error:', err);
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*path}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kaka-to-Bazara server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
