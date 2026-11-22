import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is a GitHub Pages *user site* (repository "abdelsamili.github.io"),
// served from the domain root: https://abdelsamili.github.io/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
