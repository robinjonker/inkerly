// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      strict: false
    }),

    // GH Pages base path
    paths: {
      base: '/inkerly'
    },

    prerender: {
      entries: ['*'],
      handleHttpError: ({ path, status }) => {
        if (path.endsWith('manifest.webmanifest') && status === 404) {
          return 'continue';
        }
        return 'fail';
      }
    }
  }
};

export default config;
