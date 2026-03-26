import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  // ← Yeh add karo
  reporter: [
    ['html', { open: 'always' }],  // HTML report
    ['list'],                       // Terminal mein bhi dikhe
  ],
});
