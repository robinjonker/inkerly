import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['icon.png'],
			manifest: {
				name: 'Inkerly',
				short_name: 'Inkerly',
				start_url: '/inkerly/',
				display: 'standalone',
				background_color: '#1f2937',
				theme_color: '#ec4899',
				icons: [
					{
						src: 'icon.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	base: '/inkerly/'
});
