import { defineConfig } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: { exclude: ['puchitto'] }
    }
  },
  preload: {
    build: {
      externalizeDeps: { exclude: ['puchitto'] }
    }
  },
  renderer: {
    plugins: [svelte()],
    esbuild: {
      target: 'es2022'
    }
  }
})
