const CONSTRAINTS = new Set([
  'Installation access',
  'Content approval',
  'Privacy and data handling',
  'Offline operation',
  'Existing hardware',
  'Not known yet'
]);
const EXISTING = new Set(['screens', 'content', 'network', 'sensors', 'nothing-confirmed']);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}

function clip(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

async function ipKey(request) {
  const ip = request.headers.get('cf-connecting-ip') || '0';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lead:' + ip));
  return 'lead-rate:' + [...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest(context) {
  const { request, env } = context;
  const here = new URL(request.url);
  if (request.method !== 'POST') return json({ ok: false, error: 'POST only.' }, 405);
  const origin = request.headers.get('Origin');
  if (!origin || origin !== here.origin) return json({ ok: false, error: 'origin' }, 403);
  let body;
  try { body = await request.json(); } catch (_) { return json({ ok: false, error: 'json' }, 400); }
  if (clip(body.website, 200)) return json({ ok: true, id: crypto.randomUUID(), status: 'potential' });
  if (body.consent !== true) return json({ ok: false, error: 'consent' }, 400);
  const reply = clip(body.reply, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply)) return json({ ok: false, error: 'reply' }, 400);
  const place = clip(body.place, 180);
  const audience = clip(body.audience, 180);
  const change = clip(body.change, 2000);
  const constraint = clip(body.constraint, 80);
  if (!place || !audience || !change || !CONSTRAINTS.has(constraint)) return json({ ok: false, error: 'fields' }, 400);
  const existing = Array.isArray(body.existing) ? body.existing.map((item) => clip(item, 40)).filter((item) => EXISTING.has(item)).slice(0, 5) : [];
  if (!env.LEADS) return json({ ok: false, error: 'storage' }, 503);
  const rateKey = await ipKey(request);
  const now = Date.now();
  const rate = await env.LEADS.get(rateKey, 'json') || { n: 0, start: now };
  if (now - rate.start > 60 * 60 * 1000) { rate.n = 0; rate.start = now; }
  rate.n += 1;
  await env.LEADS.put(rateKey, JSON.stringify(rate), { expirationTtl: 3600 });
  if (rate.n > 5) return json({ ok: false, error: 'rate' }, 429);
  const id = crypto.randomUUID();
  const record = {
    id,
    at: new Date().toISOString(),
    status: 'potential',
    place,
    audience,
    change,
    existing,
    constraint,
    reply,
    consentText: clip(body.consentText, 400),
    page: clip(body.page, 180),
    preview: here.hostname
  };
  await env.LEADS.put(`lead:${id}`, JSON.stringify(record));
  const notice = fetch('https://admira-telegram-bridge.csilvasantin.workers.dev/telegram/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'Mozilla/5.0' },
    body: JSON.stringify({ text: `Lead digitalsignage.ai ${id.slice(0, 8)} · ${place} · ${reply}` })
  }).catch(() => {});
  if (typeof context.waitUntil === 'function') context.waitUntil(notice);
  return json({ ok: true, id, status: 'potential' });
}
