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

## Project structure

```
pages/            Page Object Model classes (one per screen)
fixtures/         Custom Playwright fixtures (page objects + logged-in state)
test-data/        Users, products and customer data
tests/            Specs grouped by feature
.github/workflows CI pipeline
```

## Test scenarios

| # | Area | Scenario | Tag |
|---|------|----------|-----|
| 1 | Auth | Standard user logs in and sees 6 products | @smoke |
| 2 | Auth | Locked-out user gets a lockout error | @regression |
| 3 | Auth | Invalid logins (empty username, empty password, wrong password) | @regression |
| 4 | Auth | User logs out and returns to login | @smoke |
| 5 | Auth | Inventory page is blocked without login | @regression |
| 6 | Inventory | Sort by price (low→high, high→low) and name (Z→A) | @regression |
| 7 | Cart | Add/remove items updates the cart badge | @smoke |
| 8 | Cart | Cart keeps items after navigating away | @regression |
| 9 | Checkout | Full order end to end with price/tax/total checks | @smoke |
| 10 | Checkout | Form validation for missing first name, last name, postal code | @regression |

## Reports and failure evidence

| What | When | Where |
|------|------|-------|
| HTML report | Every run | `playwright-report/` (open with `npm run report`) |
| JUnit XML | Every run | `test-results/junit.xml` |
| Full-page screenshot | Failed tests only | Attached in the HTML report and in `test-results/` |
| Video (`.webm`) | Failed tests only | Attached in the HTML report and in `test-results/` |
| Trace (`trace.zip`) | Failed tests only | Open from the HTML report, or `npx playwright show-trace <trace.zip>` |

**In CI**, all browsers and shards are merged into one `playwright-report` artifact (HTML + `junit.xml`).
When something fails, each job also uploads `failure-evidence-<browser>-<shard>` with the raw screenshots,
videos and traces, and the run summary shows a pass/fail table. Download the report artifact, unzip it,
and run `npx playwright show-report playwright-report`.

**Try it:** `tests/demo/demo-failure.spec.js` contains an intentional failure that is skipped by default.

```bash
DEMO_FAILURE=1 npx playwright test tests/demo --project=chromium   # macOS/Linux
npm run report
```

Or in GitHub: **Actions → Playwright Tests → Run workflow**, tick **demo_failure**.

## Cross-browser and parallel execution

**Browsers** (projects in `playwright.config.js`):

| Project | Engine | Run it |
|---------|--------|--------|
| `chromium` | Chrome / Chromium | `npm run test:chromium` |
| `firefox` | Firefox | `npm run test:firefox` |
| `webkit` | Safari engine | `npm run test:webkit` |
| `edge` | Microsoft Edge (branded) | `npm run test:edge` (needs `npx playwright install msedge`) |

`npm test` or `npm run test:cross-browser` runs every browser.

**Parallelism** works at three levels:

1. **Tests**: `fullyParallel: true` lets every test run at the same time, each in its own isolated
   browser context. Tests never share state.
2. **Workers**: worker processes on one machine. Default is 50% of CPU cores locally and 4 on CI.
   Override with `WORKERS=6 npm test`, `npx playwright test --workers=6`, `npm run test:parallel`, or
   `npm run test:serial` (one worker, useful for debugging).
3. **Shards (CI)**: GitHub Actions splits the suite with `--shard=1/2` and `--shard=2/2` for each
   browser. That is 4 browsers x 2 shards = **8 jobs at once**, each with 4 workers. A final
   `merge reports` job combines everything into one HTML report.
