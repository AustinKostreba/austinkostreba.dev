# austinkostreba.dev

A minimal personal site built with Vite, React, and TypeScript.

## Local development

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. Vite writes the static site to `dist/`.

## Deployment

Cloudflare Pages is the simplest fit because the domain is already managed by Cloudflare and the site is fully static.

1. Push this directory to a GitHub repository.
2. In Cloudflare, open **Workers & Pages**, create a Pages application, and import the repository.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. After the first deployment, open the Pages project’s **Custom domains** section and add `austinkostreba.dev`.

Every push to the production branch will create a new deployment; pull requests receive preview deployments.

## Visual system

The implemented design decisions and extension rules live in [DESIGN.md](./DESIGN.md). Five stone-ring crops from the supplied artwork float subtly using CSS transforms, with a gentle response to nearby mouse movement. A one-time canvas operation extracts the real pigment contours; the original crops remain as fallback. Reduced motion disables movement. There is no WebGL or fluid simulation.

## Browser checks

```bash
npx playwright install chromium
npm test
```

To use an installed Chrome instead, set `CHROME_PATH` to its executable. The suite checks restrained movement, reduced motion, responsive layout, artwork rendering, and keyboard access.
