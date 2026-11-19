#!/usr/bin/env node
// Adds Schema.org markup for the media on every static page in public/:
//   - YouTube embeds and <video data-media="key">  -> VideoObject
//   - every <img> with alt text inside <main>, plus <img class="cover"> / <img data-schema-image> -> ImageObject
//     (add data-no-schema to an <img> to skip it)
//   - <audio data-media="key"> / [data-audio="key"]  -> AudioObject
// and a BreadcrumbList built from the page's visible breadcrumb (<… class="breadcrumb">).
// Metadata (dates, durations, titles in EN/FR) comes from scripts/media-registry.json.
// The block is written as <script type="application/ld+json" data-media-schema> and is
// replaced on every run, so the script is safe to run again (it runs before each build).
//
//   node scripts/media-schema.mjs           update pages, warn about missing metadata
//   node scripts/media-schema.mjs --check   same, but exit 1 if metadata is missing
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const SITE = 'https://www.proathlete.ca';
const ORG = { '@id': SITE + '/#organization' };
const LICENSE = { en: SITE + '/image-use/', fr: SITE + '/fr/utilisation-images/' };
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/media-registry.json'), 'utf8'));
const check = process.argv.includes('--check');
const missing = [];

const abs = (u) => (/^https?:/.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u));
const isoDuration = (s) => {
  s = Math.round(Number(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return 'PT' + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (sec || (!h && !m) ? sec + 'S' : '');
};
const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\s' + name + '="([^"]*)"'));
  return m ? m[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"') : null;
};
const pick = (entry, lang) => ({ ...(entry.en || {}), ...(entry[lang] || {}) });
// Publication date of the page itself, used when a video has no date of its own.
const pageDate = (html) => {
  const d = (html.match(/property="article:(?:modified|published)_time" content="([^"]+)"/) || html.match(/"date(?:Modified|Published)":\s*"([^"]+)"/) || [])[1];
  if (!d) return null;
  return /T\d/.test(d) ? d : d + 'T09:00:00-05:00';
};

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? htmlFiles(p) : d.name.endsWith('.html') ? [p] : [];
  });
}

function build(html, file) {
  const lang = /<html[^>]*lang="fr/i.test(html) ? 'fr' : 'en';
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] ||
    SITE + '/' + path.relative(PUBLIC, file).replace(/index\.html$/, '');
  const inLanguage = lang === 'fr' ? 'fr-CA' : 'en-CA';
  const rel = path.relative(ROOT, file);
  const graph = [];
  const seen = new Set();
  const once = (k) => (seen.has(k) ? false : seen.add(k));

  // Videos: YouTube embeds
  for (const m of html.matchAll(/<iframe[^>]*src="https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})[^"]*"[^>]*>/g)) {
    const id = m[1];
    if (!once('yt:' + id)) continue;
    const e = { ...(reg.videos[id] || {}) };
    // Values written on the <iframe> itself win over the registry.
    if (attr(m[0], 'data-upload-date')) e.uploadDate = attr(m[0], 'data-upload-date');
    if (attr(m[0], 'data-duration')) e.duration = Number(attr(m[0], 'data-duration'));
    if (!e.uploadDate) {
      e.uploadDate = pageDate(html);
      if (!e.uploadDate) { missing.push(`${rel}: video ${id} has no date (add it to media-registry.json or data-upload-date on the iframe)`); continue; }
      missing.push(`${rel}: video ${id} not in media-registry.json, tagged with the page date and the iframe title (add it for exact date, duration and EN/FR text)`);
    }
    const t = pick(e, lang);
    if (attr(m[0], 'data-description')) t.description = attr(m[0], 'data-description');
    graph.push({
      '@type': 'VideoObject',
      '@id': canon + '#video-' + id,
      name: t.name || attr(m[0], 'title'),
      description: t.description || t.name || attr(m[0], 'title'),
      thumbnailUrl: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
      uploadDate: e.uploadDate,
      ...(e.duration ? { duration: isoDuration(e.duration) } : {}),
      embedUrl: `https://www.youtube.com/embed/${id}`,
      url: `https://www.youtube.com/watch?v=${id}`,
      inLanguage,
      publisher: ORG,
      isPartOf: { '@id': canon },
      ...(e.clips ? { hasPart: e.clips.map((c) => ({ '@type': 'Clip', name: (c[lang] || c.en), startOffset: c.start, ...(c.end ? { endOffset: c.end } : {}), url: `https://www.youtube.com/watch?v=${id}&t=${c.start}` })) } : {})
    });
  }

  // Videos and audio hosted elsewhere: <video data-media="key"> / <audio data-media="key"> / data-audio="key"
  for (const m of html.matchAll(/<(video|audio|div|iframe)\b[^>]*\sdata-(?:media|audio)="([^"]+)"[^>]*>/g)) {
    const kind = m[1] === 'video' ? 'videos' : m[1] === 'audio' || /data-audio=/.test(m[0]) ? 'audio' : (reg.videos[m[2]] ? 'videos' : 'audio');
    const key = m[2];
    if (!once(kind + ':' + key)) continue;
    const e = reg[kind][key];
    if (!e || !e.uploadDate || !e.contentUrl) { missing.push(`${rel}: ${kind === 'videos' ? 'video' : 'audio'} "${key}" (needs uploadDate and contentUrl in media-registry.json)`); continue; }
    const t = pick(e, lang);
    graph.push({
      '@type': kind === 'videos' ? 'VideoObject' : 'AudioObject',
      '@id': canon + '#' + (kind === 'videos' ? 'video-' : 'audio-') + key,
      name: t.name,
      description: t.description || t.name,
      ...(kind === 'videos' ? { thumbnailUrl: [abs(e.thumbnailUrl || '')] } : {}),
      contentUrl: abs(e.contentUrl),
      ...(e.embedUrl ? { embedUrl: e.embedUrl } : {}),
      uploadDate: e.uploadDate,
      ...(e.duration ? { duration: isoDuration(e.duration) } : {}),
      ...(t.transcript ? { transcript: t.transcript } : {}),
      inLanguage,
      publisher: ORG,
      isPartOf: { '@id': canon }
    });
  }

  // Images: cover images and any <img data-schema-image>
  const mainStart = html.search(/<main\b/), mainEnd = html.lastIndexOf('</main>');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (/\sdata-no-schema\b/.test(tag)) continue;
    const inMain = mainStart > -1 && m.index > mainStart && m.index < mainEnd && attr(tag, 'alt');
    if (!inMain && !/class="[^"]*\bcover\b/.test(tag) && !/\sdata-schema-image\b/.test(tag)) continue;
    const src = attr(tag, 'src');
    if (!src || src.startsWith('data:') || (/^https?:/.test(src) && !src.startsWith(SITE)) || !once('img:' + src)) continue;
    const t = pick(reg.images[src] || {}, lang);
    const name = t.name || attr(tag, 'alt');
    if (!name) { missing.push(`${rel}: image ${src} (add alt text or a name in media-registry.json)`); continue; }
    const w = attr(tag, 'width'), h = attr(tag, 'height');
    graph.push({
      '@type': 'ImageObject',
      '@id': canon + '#image-' + path.basename(src).replace(/\.[^.]+$/, ''),
      contentUrl: abs(src),
      url: abs(src),
      name,
      ...(t.caption ? { caption: t.caption } : {}),
      ...(w && h ? { width: Number(w), height: Number(h) } : {}),
      inLanguage,
      creator: { '@type': 'Organization', name: 'PRO ATHLETE', ...ORG },
      creditText: 'PRO ATHLETE',
      copyrightNotice: '© PRO ATHLETE INC.',
      license: LICENSE[lang],
      acquireLicensePage: LICENSE[lang],
      isPartOf: { '@id': canon }
    });
  }
  return graph;
}


// BreadcrumbList from the visible breadcrumb: each link is a step, the last step is the page itself.
function breadcrumbs(html, file) {
  const m = html.match(/<(p|div|nav)\b[^>]*class="breadcrumb"[^>]*>([\s\S]*?)<\/\1>/);
  if (!m) return null;
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] ||
    SITE + '/' + path.relative(PUBLIC, file).replace(/index\.html$/, '');
  const text = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
  const steps = [...m[2].matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((a) => ({ name: text(a[2]), item: abs(a[1]) }));
  const current = m[2].match(/<span[^>]*aria-current="page"[^>]*>([\s\S]*?)<\/span>/);
  steps.push({ name: current ? text(current[1]) : text((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || ''), item: canon });
  if (steps.length < 2 || steps.some((s) => !s.name)) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: steps.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, item: s.item }))
  };
}

const BLOCK = /\n?\s*<script type="application\/ld\+json" data-media-schema>[\s\S]*?<\/script>/;
const CRUMB_BLOCK = /\n?\s*<script type="application\/ld\+json" data-breadcrumb-schema>[\s\S]*?<\/script>/;
let changed = 0;
for (const file of htmlFiles(PUBLIC)) {
  const html = fs.readFileSync(file, 'utf8');
  const graph = build(html, file);
  let out = html.replace(BLOCK, '').replace(CRUMB_BLOCK, '');
  const crumbs = /"BreadcrumbList"/.test(out) ? null : breadcrumbs(out, file);
  if (crumbs) {
    out = out.replace(/\s*<\/head>/, () => `\n  <script type="application/ld+json" data-breadcrumb-schema>\n${JSON.stringify(crumbs, null, 2)}\n  </script>\n</head>`);
  }
  if (graph.length) {
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
    out = out.replace(/\s*<\/head>/, () => `\n  <script type="application/ld+json" data-media-schema>\n${json}\n  </script>\n</head>`);
  }
  if (out !== html) { fs.writeFileSync(file, out); changed++; console.log('media-schema: updated', path.relative(ROOT, file), `(${graph.length} media item${graph.length === 1 ? '' : 's'}${crumbs ? ', breadcrumb' : ''})`); }
}
for (const m of missing) console.warn('media-schema: missing metadata ->', m);
console.log(`media-schema: ${changed} page(s) updated, ${missing.length} warning(s)`);
if (check && missing.length) process.exit(1);
