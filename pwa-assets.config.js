import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

const fondo = '#070F1D'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: fondo, fit: 'contain' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: fondo, fit: 'contain' } },
  },
  images: ['public/favicon.svg'],
})