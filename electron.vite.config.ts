import { defineConfig } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [svelte()],
    esbuild: {
      target: 'es2022'
    }
  }
})
