import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  "manifest_version": 3,
  "name": "Attrack - Attention Tracker",
  "version": "1.0.0",
  "description": "High-end Active Attention Data tracker.",
  "permissions": [
    "storage",
    "tabs",
    "idle"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "src/background/service-worker.ts",
    "type": "module"
  },
  "action": {
    "default_popup": "index.html"
  },
  "options_page": "dashboard.html",
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/index.tsx"]
    }
  ]
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})

