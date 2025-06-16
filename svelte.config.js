import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			strict: false
		}),
		paths: {
			base: '/inkerly'
		},
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, status }) => {
				if (path.endsWith('manifest.webmanifest') && status === 404) return 'continue';
				return 'fail';
			}
		}
	}
};

export default config;
