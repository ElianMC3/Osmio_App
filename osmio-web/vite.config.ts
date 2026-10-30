import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

const SUPABASE_HOST = /^https:\/\/[a-z0-9-]+\.supabase\.co\//i

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    /**
     * PWA: manifest + service worker (Workbox). `prompt` en vez de `autoUpdate`
     * a propósito: una recarga automática en medio de una sesión de fuerza
     * perdería series sin guardar. El aviso de nueva versión se muestra con
     * el toast del design system y el usuario decide cuándo recargar.
     */
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['apple-touch-icon-180x180.png'],
      manifest: {
        id: '/',
        name: 'Osmio — Entrenamiento y progreso',
        short_name: 'Osmio',
        description:
          'Fuerza, combate y nutrición en un solo lugar. Funciona sin conexión y sincroniza al volver la red.',
        lang: 'es',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'any',
        background_color: '#0f0e0e',
        theme_color: '#0f0e0e',
        categories: ['health', 'fitness', 'productivity'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell: JS/CSS/HTML + iconos. Las imágenes de ejercicios (12 MB)
        // y los vídeos (126 MB) NO se precargan; entran por caché en runtime
        // solo cuando el usuario las ve.
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
        globIgnores: ['exercise-images/**', 'exercise-videos/**', 'backgrounds/**'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            // Datos del usuario (REST de Supabase): red primero para no servir
            // datos viejos; si no hay red o tarda >3 s, responde de caché.
            urlPattern: new RegExp(`${SUPABASE_HOST.source}rest\\/v1\\/`, 'i'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'osmio-api',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Auth: nunca se cachean tokens ni respuestas de sesión.
            urlPattern: new RegExp(`${SUPABASE_HOST.source}auth\\/v1\\/`, 'i'),
            handler: 'NetworkOnly',
          },
          {
            // Storage (avatares, imágenes subidas): cache-first.
            urlPattern: new RegExp(`${SUPABASE_HOST.source}storage\\/v1\\/`, 'i'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'osmio-storage',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Fuentes de Google: la hoja cambia poco y los binarios son inmutables.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Imágenes locales (fondos, catálogo de ejercicios): se guardan
            // la primera vez que se ven y luego cargan al instante.
            urlPattern: /\.(?:png|jpe?g|webp|avif|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osmio-images',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname!, './src'),
    },
  },
})
