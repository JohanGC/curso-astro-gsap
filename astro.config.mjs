// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aurora.example.com',
  vite: { plugins: [tailwindcss()] },
});
