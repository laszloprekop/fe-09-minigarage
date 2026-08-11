import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  // Served from https://<user>.github.io/fe-09-minigarage/ in production.
  // Keyed on mode, not command, so `vite preview` also serves the subpath.
  base: mode === 'production' ? '/fe-09-minigarage/' : '/',
  plugins: [react(), tailwindcss()],
}));
