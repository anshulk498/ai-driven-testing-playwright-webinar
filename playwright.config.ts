import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 600000,
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://cert-comply.content.aws.lexis.com',
    trace: 'on-first-retry',
    headless: false,
    viewport: { width: 1280, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
