import {
  ThinkingLevel,
  buildAdvisorInstruction,
  createGeminiClient,
  extractCleanError,
  withGeminiRetry,
  type AdvisorContext,
  type ChatTurn,
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
    const ai = createGeminiClient(apiKey);
    const historyTurns: ChatTurn[] = Array.isArray(body.history)
      ? body.history
          .slice(-8)
          .filter((t) => t && (t.role === 'user' || t.role === 'model') && typeof t.text === 'string')
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

    res.status(200).json({ reply: replyText });
  } catch (err) {
    const message = extractCleanError(err, 'Failed to reach Gemini AI service.');
    res.status(500).json({ error: message });
  }
}
