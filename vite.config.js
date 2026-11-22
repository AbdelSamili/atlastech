import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is deployed on Vercel and served from the domain root:
// https://atlastech-solutions.vercel.app/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
