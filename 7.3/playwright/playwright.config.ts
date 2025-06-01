import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000,
    trace: 'on-first-retry',
  },
});