import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'child_process';
import fs from 'fs';

// Adds Schema.org markup (VideoObject, ImageObject, AudioObject) to the static pages in public/
// before every build, so new videos and images are tagged automatically. See scripts/MEDIA-SCHEMA.md.
const mediaSchema = () => ({
  name: 'media-schema',
  apply: 'build' as const,
  buildStart() {
    execFileSync(process.execPath, [path.resolve(__dirname, 'scripts/media-schema.mjs')], { stdio: 'inherit' });
  },
});

// FAQPage markup for the homepage, built from data/faq.json, so the FAQ questions are also understood by Google
const faqJson = (lang: 'en' | 'fr') => {
  const faq = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/faq.json'), 'utf8'));
  const toHtml = (text: string) =>
    text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': lang === 'fr' ? 'https://www.proathlete.ca/fr/#faq' : 'https://www.proathlete.ca/#faq',
    inLanguage: lang === 'fr' ? 'fr-CA' : 'en-CA',
    mainEntity: faq.personas.flatMap((p: any) =>
      p.items.map((item: any) => ({
        '@type': 'Question',
        name: item.q[lang],
        acceptedAnswer: { '@type': 'Answer', text: toHtml(item.a[lang]) }
      }))
    )
  };
  return JSON.stringify(data, null, 2).replace(/</g, '\\' + 'u003c');
};
const faqBlock = (lang: 'en' | 'fr') => `  <script type="application/ld+json" data-faq-schema>\n${faqJson(lang)}\n  </script>\n`;

// Adds the English FAQPage markup to the homepage (English is the default language at /)
const faqSchema = () => ({
  name: 'faq-schema',
  transformIndexHtml(html: string) {
    return html.replace('</head>', `${faqBlock('en')}</head>`);
  }
});

// After the build, writes one HTML file per page and language (/, /fr/, /programs/, /fr/programmes/, ...) from
// data/pages.json, each with its own language, title, description, canonical address and hreflang links.
// Google and link previews (Facebook, iMessage...) read these before the app starts, so a French link shows French.
const pageHtml = () => ({
  name: 'page-html',
  apply: 'build' as const,
  writeBundle(options: { dir?: string }) {
    const outDir = options.dir || path.resolve(__dirname, 'dist');
    const base = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
    const pages = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/pages.json'), 'utf8'));
    const SITE = 'https://www.proathlete.ca';
    const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const setTag = (html: string, re: RegExp, value: string) => {
      if (!re.test(html)) throw new Error('page-html: tag not found ' + re);
      return html.replace(re, (_m, a, _v, b) => `${a}${value}${b}`);
    };
    for (const [key, page] of Object.entries<any>(pages)) {
      for (const lang of ['en', 'fr'] as const) {
        const url = SITE + page.path[lang];
        const title = esc(page.title[lang]);
        const desc = esc(page.description[lang]);
        let html = base;
        html = setTag(html, /(<html lang=")([^"]*)(")/, lang);
        html = setTag(html, /(<title>)([^<]*)(<\/title>)/, title);
        html = setTag(html, /(<meta name="description" content=")([^"]*)(")/, desc);
        html = setTag(html, /(<link rel="canonical" href=")([^"]*)(")/, url);
        html = setTag(html, /(<meta property="og:url" content=")([^"]*)(")/, url);
        html = setTag(html, /(<meta property="og:title" content=")([^"]*)(")/, title);
        html = setTag(html, /(<meta property="og:description" content=")([^"]*)(")/, desc);
        html = setTag(html, /(<meta name="twitter:title" content=")([^"]*)(")/, title);
        html = setTag(html, /(<meta name="twitter:description" content=")([^"]*)(")/, desc);
        html = setTag(html, /(<meta property="og:locale" content=")([^"]*)(")/, lang === 'fr' ? 'fr_CA' : 'en_CA');
        html = setTag(html, /(<meta property="og:locale:alternate" content=")([^"]*)(")/, lang === 'fr' ? 'en_CA' : 'fr_CA');
        const alternates =
          `<link rel="alternate" hreflang="en-CA" href="${SITE + page.path.en}" />\n` +
          `    <link rel="alternate" hreflang="fr-CA" href="${SITE + page.path.fr}" />\n` +
          `    <link rel="alternate" hreflang="x-default" href="${SITE + page.path.en}" />`;
        html = html.replace(/(<link rel="canonical" href="[^"]*" \/>)/, `$1\n    ${alternates}`);
        // FAQ markup: only on the homepage, in the page's language
        const faqRe = /  <script type="application\/ld\+json" data-faq-schema>[\s\S]*?<\/script>\n/;
        html = html.replace(faqRe, key === 'home' ? faqBlock(lang) : '');
        const file = path.join(outDir, page.path[lang], 'index.html');
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
      }
    }
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), mediaSchema(), faqSchema(), pageHtml()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
