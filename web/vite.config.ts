import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Backend Quarkus (sicrb-backend), actif quand VITE_API_MODE=http.
      //
      // Le chemin n'est pas réécrit : le backend monte lui-même ses ressources
      // sous /api (quarkus.rest.path). Le retirer ici renvoyait toutes les
      // requêtes une racine trop haut, et donc des 404 sur chaque écran.
      //
      // Le port 8080 est occupé par Apache sur les postes de développement :
      // l'API écoute à côté.
      '/api': {
        target: process.env.VITE_API_TARGET ?? 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
