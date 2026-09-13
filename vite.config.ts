import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // En GitHub Pages el sitio queda en <usuario>.github.io/sobres/, así que en
  // build usamos esa subruta como base; en desarrollo seguimos en la raíz.
  base: command === 'build' ? '/sobres/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'splash/*.png'],
      manifest: {
        name: 'Sobres',
        short_name: 'Sobres',
        description:
          'Guía visual para repartir tus ingresos por sobres, según tus propias prioridades.',
        theme_color: '#2f5a42',
        background_color: '#f7f5f0',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
}))
