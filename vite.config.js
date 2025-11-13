import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['final-project-group4-webdevt-frontend-bf96.onrender.com'], // allow requests from any host - for dev, for final add : 
  },
});