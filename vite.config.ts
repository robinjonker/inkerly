// vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';

const dev = process.env.NODE_ENV === 'development';

export default defineConfig({
  // use "/" in dev, "/inkerly/" when you do `npm run build`
  base: dev ? '/' : '/inkerly/',
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'],
      manifestFilename: 'manifest.webmanifest',
      manifest: {
        name: 'Inkerly',
        short_name: 'Inkerly',
        // match your base path here too
        start_url: dev ? '/' : '/inkerly/',
        display: 'standalone',
        background_color: '#1f2937',
        theme_color: '#ec4899',
        icons: [
          {
            // keep this in sync with base
            src: dev ? '/icon.png' : '/inkerly/icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
