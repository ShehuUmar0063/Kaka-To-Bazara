import {
  LANGUAGE_DIRECTIVES,
  ThinkingLevel,
  Type,
  createGeminiClient,
  extractCleanError,
  withGeminiRetry,
  type AnalyzeRequestBody,
  type SupportedLanguage,
  type VercelRequest,
  type VercelResponse,
} from '../_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables.',
    });
    return;
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Partial<AnalyzeRequestBody>;
  const language: SupportedLanguage = body.language ?? 'en';
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

  const badgeExamples: Record<SupportedLanguage, { yes: string; warn: string }> = {
    en: { yes: 'YES — Good to Plant', warn: 'WARNING — High Risk of Failure' },
    ha: { yes: 'EH — Za a Iya Shuka', warn: 'GARGADI — Hadarin Bushewa Yana da Yawa' },
    ff: { yes: 'EEY — Ina Moƴƴi Aawde', warn: 'REENTU — Ina Woodi Mbonndi Yoorgol' },
    pcm: { yes: 'YES — Good to Plant', warn: 'WARNING — High Risk Make E Fail' },
  };

  const prompt = [
    'Analyze this exact farm plot for planting right now after the rainy season:',
    `- Location: ${body.lgaName ?? 'Gombe'} (Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)})`,
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
    const ai = createGeminiClient(apiKey);
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
    res.status(200).json(parsed);
  } catch (err) {
    const message = extractCleanError(err, 'Failed to analyze farm plot.');
    res.status(500).json({ error: message });
  }
}
