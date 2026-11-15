import {
  LANGUAGE_DIRECTIVES,
  ThinkingLevel,
  Type,
  createGeminiClient,
  extractCleanError,
  withGeminiRetry,
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

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as {
    language?: SupportedLanguage;
    simpleMode?: boolean;
    cropName?: string;
    locationName?: string;
  };

  const language: SupportedLanguage = body.language ?? 'en';
  const simpleMode = body.simpleMode ?? true;
  const cropName = typeof body.cropName === 'string' ? body.cropName.trim() : '';
  const locationName = typeof body.locationName === 'string' ? body.locationName.trim() : 'Gombe (Dadinkowa)';

  if (!cropName) {
    res.status(400).json({ error: 'Please select or enter a crop name.' });
    return;
  }

  const simplicityRule = simpleMode
    ? 'Keep explanations super simple and jargon-free (never write GWETROOT, EVPTRNS, NDVI, or SRTM).'
    : 'Keep advice practical, concise, and easy for smallholder farmers to scan.';

  const prompt = [
    `Build a 12-month Planting & Harvest Calendar for "${cropName}" in "${locationName}", Nigeria based on that location's typical rainy season onset, peak, and dry-season retreat.`,
    '',
    'Output Requirements:',
    `1. ${LANGUAGE_DIRECTIVES[language]}`,
    `2. ${simplicityRule}`,
    '3. "cropName": Clean crop name; "locationName": Clean location name.',
    '4. "rainySeasonSummary": 1 to 2 short plain sentences describing when rains typically start, peak, and stop in this exact Nigerian area.',
    '5. "rainFedWindow": { "plantMonths": short month range e.g. "Jun – Jul", "harvestMonths": short month range e.g. "Sep – Oct", "tip": 1 short practical sentence }.',
    '6. "drySeasonWindow": { "plantMonths": short month range e.g. "Oct – Nov" or "Not ideal", "harvestMonths": short month range e.g. "Dec – Jan", "tip": 1 short sentence about residual Fadama/river moisture or irrigation, "isRecommended": boolean }.',
    '7. "months": EXACTLY 12 items in chronological order from Jan to Dec ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"), each with:',
    '   - "month": 3-letter month name ("Jan".."Dec")',
    '   - "phase": strictly one of "land_prep", "rain_plant", "rain_grow", "rain_harvest", "dry_plant", "dry_harvest", "off_season"',
    '   - "rainLevel": strictly one of "dry", "light", "moderate", "heavy" matching typical rainfall in that Nigerian location',
    '   - "note": short 3 to 6 word action label for the farmer in the active language.',
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
              cropName: { type: Type.STRING },
              locationName: { type: Type.STRING },
              rainySeasonSummary: { type: Type.STRING },
              rainFedWindow: {
                type: Type.OBJECT,
                properties: {
                  plantMonths: { type: Type.STRING },
                  harvestMonths: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: ['plantMonths', 'harvestMonths', 'tip'],
              },
              drySeasonWindow: {
                type: Type.OBJECT,
                properties: {
                  plantMonths: { type: Type.STRING },
                  harvestMonths: { type: Type.STRING },
                  tip: { type: Type.STRING },
                  isRecommended: { type: Type.BOOLEAN },
                },
                required: ['plantMonths', 'harvestMonths', 'tip', 'isRecommended'],
              },
              months: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    month: { type: Type.STRING },
                    phase: { type: Type.STRING },
                    rainLevel: { type: Type.STRING },
                    note: { type: Type.STRING },
                  },
                  required: ['month', 'phase', 'rainLevel', 'note'],
                },
              },
            },
            required: ['cropName', 'locationName', 'rainySeasonSummary', 'rainFedWindow', 'drySeasonWindow', 'months'],
          },
        },
      })
    );

    const rawText = (response.text ?? '{}').trim();
    const parsed = JSON.parse(rawText);
    res.status(200).json(parsed);
  } catch (err) {
    const message = extractCleanError(err, 'Failed to build planting calendar.');
    res.status(500).json({ error: message });
  }
}
