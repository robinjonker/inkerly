// vite.config.js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // your repo name as the base path on GH Pages
  base: '/inkerly/',
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'],
      manifestFilename: 'manifest.webmanifest',
      manifest: {
        name: 'Inkerly',
        short_name: 'Inkerly',
        // everything under /inkerly/
        start_url: '/inkerly/',
        display: 'standalone',
        background_color: '#1f2937',
        theme_color: '#ec4899',
        icons: [
          {
            src: '/inkerly/icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
