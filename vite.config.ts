// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages serves the project at /<repo>/, so the asset base and the router
// basepath have to agree. BASE_PATH is set by the Pages workflow; "/" locally.
const base = process.env["BASE_PATH"] ?? "/";

export default defineConfig({
  vite: { base },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // The deck is one route driven by search params and needs no server, so a
    // prerendered SPA shell serves all 113 slides from static files.
    spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } },
  },
  nitro: false,
});
