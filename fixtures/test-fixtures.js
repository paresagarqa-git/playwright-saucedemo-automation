// @ts-check
const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { users } = require('../test-data/users');

/**
 * Custom fixtures: every test can ask for page objects by name, e.g.
 *   test('...', async ({ loginPage, inventoryPage }) => { ... })
 *
 * `loggedInPage` logs in as standard_user before the test body runs and
 * hands back the InventoryPage, so tests that are not about login skip the boilerplate.
 */
const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    const inventoryPage = new InventoryPage(page);
    await base.expect(inventoryPage.title).toHaveText('Products');
    await use(inventoryPage);
  },
});

module.exports = { test, expect: base.expect };
