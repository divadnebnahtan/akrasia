import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    alias: {
        $content: 'src/content',
        $lib: 'src/lib',
    },
	kit: {
        adapter: adapter()
    },
	preprocess: [
        mdsvex({
            extensions: ['.svx', '.md'],
        })
    ],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
