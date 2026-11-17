# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:vercel" --install pnpm akrasia.github.io
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Akrasia source map

This is the Akrasia personal site. Use `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm check`, and `pnpm build` with the checked-in pnpm lockfile. `src/routes/` contains SvelteKit pages, `src/lib/components/` contains shared UI, `src/lib/widgets/` contains interactive post widgets, and `src/content/` contains posts. `src/lib/posts.ts` loads post content, while `src/lib/config.ts` holds site metadata and shared display settings. Public images and crawler files live in `static/` and are addressed from `/`.

Keep post loading on the server where routes already use `+page.server.ts`; avoid moving content or changing slugs without updating links. This checkout has active content and layout work, so those modules retain their existing boundaries.
