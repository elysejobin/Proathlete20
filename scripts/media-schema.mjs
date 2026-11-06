#!/usr/bin/env node
// Adds Schema.org markup for the media on every static page in public/:
//   - YouTube embeds and <video data-media="key">  -> VideoObject
//   - <img class="cover"> and <img data-schema-image> -> ImageObject
//   - <audio data-media="key"> / [data-audio="key"]  -> AudioObject
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
    const e = reg.videos[id];
    if (!e || !e.uploadDate) { missing.push(`${rel}: video ${id} (add it to videos in media-registry.json)`); continue; }
    const t = pick(e, lang);
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
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/class="[^"]*\bcover\b/.test(tag) && !/\sdata-schema-image\b/.test(tag)) continue;
    const src = attr(tag, 'src');
    if (!src || !once('img:' + src)) continue;
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

const BLOCK = /\n?\s*<script type="application\/ld\+json" data-media-schema>[\s\S]*?<\/script>/;
let changed = 0;
for (const file of htmlFiles(PUBLIC)) {
  const html = fs.readFileSync(file, 'utf8');
  const graph = build(html, file);
  let out = html.replace(BLOCK, '');
  if (graph.length) {
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
    out = out.replace('</head>', `  <script type="application/ld+json" data-media-schema>\n${json}\n  </script>\n</head>`);
  }
  if (out !== html) { fs.writeFileSync(file, out); changed++; console.log('media-schema: updated', path.relative(ROOT, file), `(${graph.length} item${graph.length === 1 ? '' : 's'})`); }
}
for (const m of missing) console.warn('media-schema: missing metadata ->', m);
console.log(`media-schema: ${changed} page(s) updated, ${missing.length} warning(s)`);
if (check && missing.length) process.exit(1);
