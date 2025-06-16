import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'icon.png'], // icons in static/
			manifest: {
				name: 'Inkerly',
				short_name: 'Inkerly',
				start_url: '/',
				display: 'standalone',
				background_color: '#1f2937', // Tailwind bg-gray-800
				theme_color: '#ec4899',      // Tailwind pink-500
				icons: [
					{
						src: '/icon.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			}
		})
	]
});
