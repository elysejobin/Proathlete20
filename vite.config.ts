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

// Adds FAQPage markup to the homepage from data/faq.json (English, the homepage's default language),
// so the questions shown in the FAQ section are also understood by Google.
const faqSchema = () => ({
  name: 'faq-schema',
  transformIndexHtml(html: string) {
    const faq = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/faq.json'), 'utf8'));
    const toHtml = (text: string) =>
      text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': 'https://www.proathlete.ca/#faq',
      mainEntity: faq.personas.flatMap((p: any) =>
        p.items.map((item: any) => ({
          '@type': 'Question',
          name: item.q.en,
          acceptedAnswer: { '@type': 'Answer', text: toHtml(item.a.en) }
        }))
      )
    };
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\' + 'u003c');
    return html.replace('</head>', `  <script type="application/ld+json" data-faq-schema>\n${json}\n  </script>\n</head>`);
  }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), mediaSchema(), faqSchema()],
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
