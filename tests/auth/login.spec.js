// @ts-check
const { test, expect } = require('../../fixtures/test-fixtures');
const loginData = require('../../test-data/login-data.json');

/**
 * Data-driven login tests.
 * Every row in test-data/login-data.json becomes its own test,
 * so adding a user or a negative case needs no code changes.
 */
test.describe('Login: valid users', () => {
  for (const user of loginData.validUsers) {
    test(`${user.description} (${user.username}) can log in @smoke`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByTestId('title')).toHaveText('Products');
      await expect(page.getByTestId('inventory-item')).toHaveCount(6);
    });
  }
});

test.describe('Login: failed logins', () => {
  for (const data of loginData.invalidLogins) {
    test(`shows an error for ${data.description} @regression`, async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(data.username, data.password);

      await expect(loginPage.errorMessage).toHaveText(data.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }
});

test.describe('Session', () => {
  test('user can log out and is returned to the login page @smoke', async ({ page, loggedInPage, loginPage }) => {
    await loggedInPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('inventory page is protected when not logged in @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
