// Edge Finder odds proxy — a Cloudflare Worker.
// Holds your Odds API key as a secret, checks an access code, and caches
// responses so many users share one pull (saves credits).
//
// Settings (Worker → Settings → Variables and Secrets):
//   ODDS_API_KEY   (Secret)  your The Odds API key
//   ACCESS_CODES   (Text)    comma-separated codes you hand out, e.g. "zach,mike2026,beta-crew"
//   CACHE_SECONDS  (Text)    optional, how long to reuse odds (default 45)

const MEM = new Map();      // cache: upstream url -> {t, status, body, h}
const PENDING = new Map();  // de-dupes simultaneous requests for the same url

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Expose-Headers': 'x-requests-remaining, x-requests-used, x-cache',
};
const json = (obj, status) =>
  new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'content-type': 'application/json' } });

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(req.url);
    if (url.pathname === '/') return json({ ok: true, service: 'edge-finder-proxy' }, 200);

    // access code check
    const codes = (env.ACCESS_CODES || '').split(',').map(s => s.trim()).filter(Boolean);
    const code = url.searchParams.get('code') || '';
    if (!codes.length || !codes.includes(code)) return json({ message: 'Invalid access code' }, 401);
    if (!env.ODDS_API_KEY) return json({ message: 'Server is missing ODDS_API_KEY' }, 500);

    // only allow the two endpoints the app uses
    const m = url.pathname.match(/^\/v4\/sports\/([a-z0-9_]+)\/(odds|scores)\/?$/);
    if (!m) return json({ message: 'Not found' }, 404);
    const [, sport, kind] = m;
    const up = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/${kind}/`);
    const allowed = kind === 'odds' ? ['bookmakers', 'markets', 'oddsFormat', 'includeLinks', 'regions'] : ['daysFrom'];
    for (const k of allowed) { const v = url.searchParams.get(k); if (v != null) up.searchParams.set(k, v); }
    up.searchParams.sort();
    const key = up.toString();
    const ttl = (kind === 'odds' ? Number(env.CACHE_SECONDS || 45) : 300) * 1000;

    const hit = MEM.get(key);
    if (hit && Date.now() - hit.t < ttl) return respond(hit, 'HIT');

    if (!PENDING.has(key)) {
      PENDING.set(key, (async () => {
        const authed = new URL(key);
        authed.searchParams.set('apiKey', env.ODDS_API_KEY);
        const r = await fetch(authed.toString());
        const entry = { t: Date.now(), status: r.status, body: await r.text(), h: {} };
        for (const k of ['x-requests-remaining', 'x-requests-used']) { const v = r.headers.get(k); if (v) entry.h[k] = v; }
        if (r.ok) {
          MEM.set(key, entry);
          if (MEM.size > 300) MEM.delete(MEM.keys().next().value);
        }
        return entry;
      })().finally(() => PENDING.delete(key)));
    }
    return respond(await PENDING.get(key), 'MISS');
  },
};

function respond(e, cache) {
  return new Response(e.body, { status: e.status, headers: { ...CORS, 'content-type': 'application/json', ...e.h, 'x-cache': cache } });
}
