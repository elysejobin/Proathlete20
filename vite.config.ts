import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'child_process';

// Adds Schema.org markup (VideoObject, ImageObject, AudioObject) to the static pages in public/
// before every build, so new videos and images are tagged automatically. See scripts/MEDIA-SCHEMA.md.
const mediaSchema = () => ({
  name: 'media-schema',
  apply: 'build' as const,
  buildStart() {
    execFileSync(process.execPath, [path.resolve(__dirname, 'scripts/media-schema.mjs')], { stdio: 'inherit' });
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), mediaSchema()],
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
