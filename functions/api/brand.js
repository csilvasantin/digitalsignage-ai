const MARCA = 'https://www.admiranext.com/marcablanca/api/analizar';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}

function publicHttps(raw) {
  let url;
  try { url = new URL(String(raw || '').trim()); } catch (_) { return null; }
  if (url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  const host = url.hostname.toLowerCase().replace(/\.+$/, '');
  if (!host.includes('.') || host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localhost')) return null;
  if (host.includes(':') || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null;
  url.hash = '';
  return url;
}

function meta(html, attr, key) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, 'i');
  const tag = html.match(re);
  if (!tag) return '';
  const content = tag[0].match(/content=["']([^"']+)["']/i);
  return content ? decode(content[1]).slice(0, 300) : '';
}

function decode(value) {
  return String(value || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function textOf(html, re) {
  const match = html.match(re);
  return match ? decode(match[1].replace(/<[^>]+>/g, ' ')).slice(0, 180) : '';
}

async function ipKey(request, prefix) {
  const ip = request.headers.get('cf-connecting-ip') || '0';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(prefix + ip));
  const hex = [...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
  return prefix + hex;
}

async function allow(kv, key, limit, windowSec) {
  if (!kv) return true;
  const now = Date.now();
  const cur = await kv.get(key, 'json') || { n: 0, start: now };
  if (now - cur.start > windowSec * 1000) { cur.n = 0; cur.start = now; }
  cur.n += 1;
  await kv.put(key, JSON.stringify(cur), { expirationTtl: windowSec });
  return cur.n <= limit;
}

async function readPage(start) {
  let current = start;
  for (let hop = 0; hop < 3; hop += 1) {
    const response = await fetch(current, {
      redirect: 'manual',
      headers: { accept: 'text/html', 'user-agent': 'ADmiraNeXT-brand-preview/1.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (response.status >= 300 && response.status < 400) {
      const next = publicHttps(new URL(response.headers.get('location') || '', current).href);
      if (!next) return { error: 'The redirect left the public web.' };
      current = next.href;
      continue;
    }
    const buffer = await response.arrayBuffer();
    const html = new TextDecoder('utf-8', { fatal: false }).decode(buffer.slice(0, 350000));
    const icon = textOf(html, /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i);
    return {
      status: response.status,
      finalUrl: current,
      title: textOf(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: meta(html, 'name', 'description') || meta(html, 'property', 'og:description'),
      image: meta(html, 'property', 'og:image'),
      themeColor: meta(html, 'name', 'theme-color'),
      icon: icon && publicHttps(new URL(icon, current).href) ? new URL(icon, current).href : ''
    };
  }
  return { error: 'Too many redirects.' };
}

export async function onRequest(context) {
  const { request, env } = context;
  const here = new URL(request.url);
  if (request.method !== 'POST') return json({ ok: false, error: 'POST only.' }, 405);
  const origin = request.headers.get('Origin');
  if (!origin || origin !== here.origin) return json({ ok: false, error: 'Origin not allowed.' }, 403);
  let body;
  try { body = await request.json(); } catch (_) { return json({ ok: false, error: 'Invalid JSON.' }, 400); }
  const url = publicHttps(body && body.url);
  if (!url) return json({ ok: false, error: 'Use a public https:// website.' }, 400);
  const kv = env.LEADS;
  if (!(await allow(kv, await ipKey(request, 'brand-rate:'), 8, 600))) {
    return json({ ok: false, error: 'Too many brand readings from this connection. Try again in a few minutes.' }, 429);
  }
  const cacheKey = `brand:${url.hostname}`;
  if (kv) {
    const cached = await kv.get(cacheKey, 'json');
    if (cached && cached.ok) return json({ ...cached, cached: true });
  }
  let page = {};
  try { page = await readPage(url.href); } catch (error) {
    page = { error: error && error.name === 'TimeoutError' ? 'The website took too long.' : 'The website could not be reached.' };
  }
  let analyzed = null;
  let analyzeError = '';
  try {
    const response = await fetch(MARCA, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json', origin: 'https://www.admiranext.com' },
      body: JSON.stringify({ url: url.href }),
      signal: AbortSignal.timeout(20000)
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data && data.ok && data.propuesta) analyzed = data;
    else analyzeError = (data && data.error) || `Marca Blanca answered HTTP ${response.status}.`;
  } catch (_) {
    analyzeError = 'Marca Blanca could not be reached.';
  }
  if (!analyzed && page.error) return json({ ok: false, error: analyzeError || page.error }, 422);
  const propuesta = analyzed ? analyzed.propuesta : null;
  const payload = {
    ok: true,
    url: url.href,
    host: url.hostname,
    source: propuesta ? 'marcablanca' : 'page',
    propuesta,
    page: {
      title: page.title || '',
      description: page.description || '',
      themeColor: page.themeColor || '',
      image: page.image || '',
      icon: page.icon || ''
    },
    aviso: (analyzed && analyzed.aviso) || page.error || analyzeError || 'Read from the public page. Not an official brand.',
    generator: {
      used: false,
      note: 'prospectUrl on the PR #28 preview is not called. This response does not write the catalog.'
    }
  };
  if (kv && propuesta) await kv.put(cacheKey, JSON.stringify(payload), { expirationTtl: 12 * 60 * 60 });
  return json(payload);
}
