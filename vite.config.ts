import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      // ⚠️ ВАЖНО для localhost
      devOptions: {
        enabled: true
      },

      manifest: {
        name: "FlatFinder",
        short_name: "FlatFinder",
        description: "Поиск квартир в Израиле",
        start_url: "/",
        display: "standalone",

        background_color: "#0f0f14",
        theme_color: "#0f0f14",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
