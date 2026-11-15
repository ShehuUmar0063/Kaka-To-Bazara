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
  };

  const language: SupportedLanguage = body.language ?? 'en';
  const simpleMode = body.simpleMode ?? true;
  const cropName = typeof body.cropName === 'string' ? body.cropName.trim() : '';

  if (!cropName) {
    res.status(400).json({ error: 'Please select or enter a crop name.' });
    return;
  }

  const simplicityRule = simpleMode
    ? 'Keep explanations super simple and jargon-free (do not write GWETROOT, EVPTRNS, NDVI, or SRTM).'
    : 'Keep explanations clear, practical, and easy to scan on mobile.';

  const prompt = [
    `A Nigerian farmer wants to grow and harvest: "${cropName}".`,
    'Analyze this crop’s water, soil, and heat requirements across Nigeria’s ecological zones (Sudan Savanna, Guinea Savanna, Fadama River Basins, Mid-Altitude Plateau, and Rainforest).',
    '',
    'Output Requirements:',
    `1. ${LANGUAGE_DIRECTIVES[language]}`,
    `2. ${simplicityRule}`,
    '3. "cropName": The clean name of the crop in the active language.',
    '4. "summary": 2 short sentences explaining what kind of soil, moisture, and heat this crop needs across Nigeria.',
    '5. "plantingWindow": 1 to 2 crisp sentences comparing Rain-fed planting vs. Dry-Season Residual / Fadama farming for this crop in Nigeria.',
    '6. "keyRisk": 1 short, practical bullet sentence warning about the main risk (e.g., drought at flowering, flooding, striga, pests, or heat stress).',
    '7. "topRegions": EXACTLY 4 top Nigerian states/regions best suited for this crop, each with:',
    '   - "stateName": e.g., "Gombe State", "Jigawa State", "Kaduna State", "Benue State", "Plateau State", "Zamfara State", "Ondo State", etc.',
    '   - "townBasin": exact major farming town or river basin (e.g., "Dadinkowa / Yamaltu-Deba", "Hadejia-Jama’are Basin", "Bakolori / Talata Mafara", "Zaria / Giwa", "Jos South / Barkin Ladi", "Gboko / Benue Valley")',
    '   - "ecologicalZone": one of Sudan Savanna, Guinea Savanna, Fadama River Basin, Mid-Altitude Plateau, or Tropical Rainforest',
    '   - "lat" and "lon": accurate real-world Nigeria coordinates inside that exact farming town/basin (latitude between 4.5 and 13.7, longitude between 2.8 and 14.5)',
    '   - "whyItFits": 1–2 short sentences explaining why that region’s soil and climate fit the crop.',
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
              summary: { type: Type.STRING },
              plantingWindow: { type: Type.STRING },
              keyRisk: { type: Type.STRING },
              topRegions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stateName: { type: Type.STRING },
                    townBasin: { type: Type.STRING },
                    ecologicalZone: { type: Type.STRING },
                    lat: { type: Type.NUMBER },
                    lon: { type: Type.NUMBER },
                    whyItFits: { type: Type.STRING },
                  },
                  required: ['stateName', 'townBasin', 'ecologicalZone', 'lat', 'lon', 'whyItFits'],
                },
              },
            },
            required: ['cropName', 'summary', 'plantingWindow', 'keyRisk', 'topRegions'],
          },
        },
      })
    );

    const rawText = (response.text ?? '{}').trim();
    const parsed = JSON.parse(rawText);
    res.status(200).json(parsed);
  } catch (err) {
    const message = extractCleanError(err, 'Failed to analyze Nigerian crop zones.');
    res.status(500).json({ error: message });
  }
}
