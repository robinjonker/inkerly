// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      // fallback for client-side routing on gh-pages
      fallback: '404.html',
      strict: false
    }),

    paths: {
      // only use the "/inkerly" base when building for prod
      base: dev ? '' : '/inkerly'
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

    // -- note: no trailingSlash here --
  }
};

export default config;
