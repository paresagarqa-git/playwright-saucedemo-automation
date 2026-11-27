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
npm run test:webkit    # one browser: test:chromium / test:firefox / test:webkit / test:edge
WORKERS=4 npm test     # choose how many tests run in parallel
npm run report         # open the HTML report
```

## Continuous integration

Every pull request and every push to `main` runs the suite on Chromium, Firefox, WebKit (Safari engine)
and Microsoft Edge in GitHub Actions, as four parallel jobs. Inside each job the tests run in parallel
workers (`fullyParallel: true`, 2 workers on CI). The HTML report is uploaded as a build artifact
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

**In CI**, every run uploads `playwright-report-<browser>` as an artifact. When something fails it also
uploads `failure-evidence-<browser>` with the raw screenshots, videos and traces, and the run summary
shows a pass/fail table. Download the report artifact, unzip it, and run `npx playwright show-report <folder>`.

**Try it:** `tests/demo/demo-failure.spec.js` contains an intentional failure that is skipped by default.

```bash
DEMO_FAILURE=1 npx playwright test tests/demo --project=chromium   # macOS/Linux
npm run report
```

Or in GitHub: **Actions → Playwright Tests → Run workflow**, tick **demo_failure**.
