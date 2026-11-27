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

  // Parallel execution: every test (not just every file) can run on its own worker,
  // and each test gets its own isolated browser context.
  fullyParallel: true,

  // Fail the CI build if someone accidentally commits test.only.
  forbidOnly: !!process.env.CI,

  // Retry on CI only, so flaky tests are visible locally.
  retries: process.env.CI ? 2 : 0,
  // Number of parallel workers. Override with WORKERS=4 (or --workers=4).
  // Default: 2 on CI runners (2 vCPUs), half the CPU cores locally.
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : process.env.CI ? 2 : undefined,

  // Reports:
  //  - html  : interactive report with screenshots, videos and traces of failed tests
  //  - junit : XML results, understood by most CI tools
  //  - github: annotates failures inline on the PR (CI only)
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ...(process.env.CI ? [['github']] : []),
  ],

  // Screenshots, videos and traces of each test are written here.
  outputDir: 'test-results',

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    // SauceDemo uses data-test="..." attributes, so getByTestId() maps to them.
    testIdAttribute: 'data-test',
    // Failure evidence: only kept when a test fails, so passing runs stay fast and small.
    screenshot: { mode: 'only-on-failure', fullPage: true },
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Cross-browser: every test runs once per project.
  //   npx playwright test --project=webkit     -> one browser
  //   npx playwright test                      -> all of them
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Branded Microsoft Edge (installed browser, not a Playwright download).
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
