// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('leaflet') || id.includes('react-leaflet') || id.includes('@react-leaflet')) {
              return 'leaflet-vendor';
            }
          }
        }
      }
    },
    ssr: {
      external: ["react-leaflet", "leaflet", "@react-leaflet/core"],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: (process.env.VERCEL || process.env.NOW_BUILDER) ? "vercel" : "node-server",
    // @ts-expect-error - Nitro types in vite config are incomplete
    externals: {
      external: ["react-leaflet", "leaflet", "@react-leaflet/core"]
    }
  },
});
