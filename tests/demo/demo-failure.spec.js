// @ts-check
const { test, expect } = require('../../fixtures/test-fixtures');

/**
 * Deliberately failing test, used only to SEE the failure evidence
 * (screenshot, video, trace) in the HTML report.
 *
 * Skipped by default. Run it with:
 *   DEMO_FAILURE=1 npx playwright test tests/demo        (macOS/Linux)
 *   $env:DEMO_FAILURE=1; npx playwright test tests/demo  (Windows PowerShell)
 * or in GitHub: Actions → Playwright Tests → Run workflow → tick "demo_failure".
 */
test.describe('Demo: failure evidence', () => {
  test.skip(!process.env.DEMO_FAILURE, 'Set DEMO_FAILURE=1 to run this intentional failure');

  test('cart badge shows the wrong count (intentional failure) @demo', async ({ loggedInPage }) => {
    await loggedInPage.addToCart('Sauce Labs Backpack');
    // Wrong on purpose: one item was added, so the badge says "1".
    await expect(loggedInPage.cartBadge, 'intentional failure to demo reporting').toHaveText('5');
  });
});
