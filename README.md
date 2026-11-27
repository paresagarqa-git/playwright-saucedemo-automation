# Playwright SauceDemo Automation

End-to-end UI test suite for [saucedemo.com](https://www.saucedemo.com), written with
**Playwright Test** in **JavaScript**.

## Tech stack

- Playwright Test runner (`@playwright/test`)
- Page Object Model (`pages/`)
- Custom fixtures (`fixtures/`)
- Centralised test data (`test-data/`)
- GitHub Actions CI (`.github/workflows/playwright.yml`)

## Getting started

```bash
npm ci
npx playwright install --with-deps
npm test               # run everything headless
npm run test:headed    # watch the browser
npm run test:ui        # Playwright UI mode
npm run test:smoke     # only @smoke tests
npm run report         # open the HTML report
```

## Continuous integration

Every pull request and every push to `main` runs the suite on Chromium and Firefox in
GitHub Actions. The HTML report is uploaded as a build artifact
(Actions tab → run → *Artifacts*).
