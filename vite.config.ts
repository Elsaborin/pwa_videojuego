import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // La librería del mapa (pesada) va en su propio archivo y solo se descarga cuando se muestra el mapa
      output: { manualChunks: id => (id.includes('node_modules/mapbox-gl') ? 'mapbox' : undefined) },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        id: '/',
        name: 'After Light',
        short_name: 'After Light',
        description: 'Videojuego de supervivencia, cartas y evento',
        lang: 'es',
        theme_color: '#070F1D',
        background_color: '#070F1D',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        categories: ['games', 'entertainment'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Guarda también las imágenes y los íconos para que la app se vea completa sin conexión
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,webmanifest}'],
        cleanupOutdatedCaches: true,
        globIgnores: ['**/mapbox-*.js'],
        runtimeCaching: [
          { urlPattern: /\/data\/.*\.json$/, handler: 'NetworkFirst', options: { cacheName: 'data' } },
          { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, handler: 'StaleWhileRevalidate', options: { cacheName: 'ext' } },
        ],
      },
    }),
  ],
})