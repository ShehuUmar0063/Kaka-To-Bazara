import type { VercelRequest, VercelResponse } from './_shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const latRaw = Array.isArray(req.query?.lat) ? req.query.lat[0] : req.query?.lat;
  const lonRaw = Array.isArray(req.query?.lon) ? req.query.lon[0] : req.query?.lon;
  const lat = Number(latRaw);
  const lon = Number(lonRaw);

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
    res.status(200).json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to reach NASA POWER API';
    res.status(502).json({ error: message });
  }
}
