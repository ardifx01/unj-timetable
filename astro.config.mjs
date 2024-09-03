import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    AstroPWA({
      mode: "development",
      base: "/",
      scope: "/",
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#0074d9",
        name: "UNJ Timetable | Penyusun KRS menjadi jadwal yang rapih!",
        short_name: "UNJ Timetable",
        description:
          "Sebuah web yang menyusun KRS menjadi jadwal perkuliahan yang rapih secara otomatis.",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/404",
        globPatterns: ["**/*.{css,js,html,png,jpg,ico}"],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/404$/],
      },
    }),
    tailwind(),
    react(),
  ],
});
