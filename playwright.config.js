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

  // PARALLEL EXECUTION
  // fullyParallel: every test (not just every file) can run at the same time,
  // each in its own isolated browser context, so tests must not depend on each other.
  fullyParallel: true,

  // Fail the CI build if someone accidentally commits test.only.
  forbidOnly: !!process.env.CI,

  // Retry on CI only, so flaky tests are visible locally.
  retries: process.env.CI ? 2 : 0,

  // Number of parallel worker processes. Override with WORKERS=4 (or --workers=4).
  // Default: 4 on CI (GitHub runners have 4 cores), 50% of CPU cores locally.
  workers: process.env.WORKERS ? Number(process.env.WORKERS) : process.env.CI ? 4 : '50%',

  // Reports:
  //  - html  : interactive report with screenshots, videos and traces of failed tests
  //  - junit : XML results, understood by most CI tools
  //  - github: annotates failures inline on the PR (CI only)
  //  - blob  : (CI only) raw results per shard, merged into ONE html report afterwards
  reporter: process.env.CI
    ? [['list'], ['blob'], ['github']]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
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

  // CROSS-BROWSER: the same tests run on every engine below.
  // Pick one with --project, e.g. npx playwright test --project=webkit
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Branded Microsoft Edge (installed with: npx playwright install msedge)
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
