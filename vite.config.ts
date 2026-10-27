import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { routesPlugin } from './plugins/routes';
import { STATIC_ROUTES, TEMPLATE_FILES } from './site.config';

const input = Object.fromEntries([...STATIC_ROUTES.map((r) => r.file), ...TEMPLATE_FILES, '404.html'].map((f) => [f.replace('.html', ''), resolve(__dirname, f)]));

export default defineConfig({
  appType: 'mpa',
  plugins: [routesPlugin()],
  server: { port: 5173, strictPort: false },
  build: { target: 'es2022', cssCodeSplit: true, chunkSizeWarningLimit: 700, // hls.js is a lazy chunk, loaded only for .m3u8 sources
     rollupOptions: { input } },
});
