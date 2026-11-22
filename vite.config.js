import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is served from https://<username>.github.io/atlastech/
// so every asset URL must be prefixed with the repository name.
export default defineConfig({
  base: '/atlastech/',
  plugins: [react()],
})
