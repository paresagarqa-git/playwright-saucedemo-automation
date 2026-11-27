// @ts-check
const { test, expect } = require('../../fixtures/test-fixtures');
const { users } = require('../../test-data/users');

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and sees the product list @smoke', async ({ page, loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('locked out user sees a lockout error @regression', async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // Data-driven negative tests: one test per row.
  const invalidLogins = [
    { case: 'empty username', username: '', password: 'secret_sauce', error: 'Epic sadface: Username is required' },
    { case: 'empty password', username: 'standard_user', password: '', error: 'Epic sadface: Password is required' },
    {
      case: 'wrong password',
      username: 'standard_user',
      password: 'wrong_password',
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
  ];

  for (const data of invalidLogins) {
    test(`shows an error for ${data.case} @regression`, async ({ loginPage }) => {
      await loginPage.login(data.username, data.password);
      await expect(loginPage.errorMessage).toHaveText(data.error);
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
