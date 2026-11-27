// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for the SauceDemo suite.
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Run test files in parallel; each test gets its own isolated browser context.
  fullyParallel: true,

  // Fail the CI build if someone accidentally commits test.only.
  forbidOnly: !!process.env.CI,

  // Retry on CI only, so flaky tests are visible locally.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    // SauceDemo uses data-test="..." attributes, so getByTestId() maps to them.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
