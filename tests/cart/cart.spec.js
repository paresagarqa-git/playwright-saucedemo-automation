// @ts-check
const { test, expect } = require('../../fixtures/test-fixtures');
const { products } = require('../../test-data/products');

test.describe('Shopping cart', () => {
  test('adding and removing items updates the cart badge @smoke', async ({ loggedInPage }) => {
    await expect(loggedInPage.cartBadge).toBeHidden();

    await loggedInPage.addToCart(products.backpack.name);
    await loggedInPage.addToCart(products.bikeLight.name);
    await expect(loggedInPage.cartBadge).toHaveText('2');

    await loggedInPage.removeFromCart(products.backpack.name);
    await expect(loggedInPage.cartBadge).toHaveText('1');

    await loggedInPage.removeFromCart(products.bikeLight.name);
    await expect(loggedInPage.cartBadge).toBeHidden();
  });

  test('cart shows the selected items and keeps them after navigating away @regression', async ({
    page,
    loggedInPage,
    cartPage,
  }) => {
    await loggedInPage.addToCart(products.backpack.name);
    await loggedInPage.addToCart(products.fleeceJacket.name);
    await loggedInPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.fleeceJacket.name]);

    // Go back to shopping and return: the cart should still hold both items.
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await loggedInPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});
