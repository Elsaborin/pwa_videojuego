import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'After Light',
        short_name: 'AfterLight',
        description: 'Videojuego de supervivencia, cartas y evento',
        theme_color: '#070F1D',
        background_color: '#070F1D',
        display: 'standalone',
        start_url: '/',
        lang: 'es',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          { urlPattern: /\/data\/.*\.json$/, handler: 'NetworkFirst', options: { cacheName: 'data' } },
          { urlPattern: /^https:\/\/(fonts\.(googleapis|gstatic)\.com|api\.open-meteo\.com)\/.*/, handler: 'StaleWhileRevalidate', options: { cacheName: 'ext' } },
        ],
      },
    }),
  ],
})
