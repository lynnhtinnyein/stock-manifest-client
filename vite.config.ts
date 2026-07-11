import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        babel({ presets: [reactCompilerPreset()] }),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg"],
            manifest: {
                name: "I want it, I got it",
                short_name: "I want it, I got it",
                description: "Online sale inventory management for Bangkok depot",
                theme_color: "#1b2430",
                background_color: "#f5f5f1",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "assets/icons/icon-72x72.png",
                        sizes: "72x72",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-96x96.png",
                        sizes: "96x96",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-128x128.png",
                        sizes: "128x128",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-144x144.png",
                        sizes: "144x144",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-152x152.png",
                        sizes: "152x152",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-384x384.png",
                        sizes: "384x384",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "assets/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    }
                ]
            }
        })
    ],
    resolve: {
        tsconfigPaths: true
    }
});
