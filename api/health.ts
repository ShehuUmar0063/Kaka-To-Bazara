import type { VercelRequest, VercelResponse } from './_shared';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'ok' });
}
