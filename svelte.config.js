import adapter from '@sveltejs/adapter-static';
import { VitePWA } from 'vite-plugin-pwa';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
  vitePlugin: {
    vite: {
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          manifest: {
            name: 'Inkerly',
            short_name: 'Inkerly',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#000000',
            icons: [
              {
                src: '/icon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
              }
            ]
          }
        })
      ]
    }
  }
};

export default config;
