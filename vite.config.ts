import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: '/job-hunt-tracker/', // Change this to your GitHub repo name
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'docs', // GitHub Pages serves from docs/ folder
    emptyOutDir: true
  }
})


