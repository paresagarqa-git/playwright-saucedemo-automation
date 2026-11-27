// @ts-check
const { test, expect } = require('../../fixtures/test-fixtures');
const { products, customer } = require('../../test-data/products');

test.describe('Checkout', () => {
  test('user can complete an order end to end @smoke', async ({ page, loggedInPage, cartPage, checkoutPage }) => {
    await test.step('add two products to the cart', async () => {
      await loggedInPage.addToCart(products.backpack.name);
      await loggedInPage.addToCart(products.boltTShirt.name);
      await loggedInPage.openCart();
      await expect(cartPage.cartItems).toHaveCount(2);
    });

    await test.step('enter customer information', async () => {
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await checkoutPage.fillInformation(customer);
    });

    await test.step('verify the order totals', async () => {
      await expect(page).toHaveURL(/checkout-step-two\.html/);

      const expectedSubtotal = products.backpack.price + products.boltTShirt.price;
      const subtotal = await checkoutPage.amountFrom(checkoutPage.subtotalLabel);
      const tax = await checkoutPage.amountFrom(checkoutPage.taxLabel);
      const total = await checkoutPage.amountFrom(checkoutPage.totalLabel);

      expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await test.step('finish and see the confirmation', async () => {
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutPage.cartBadge).toBeHidden();
    });
  });

  const missingFields = [
    { field: 'first name', data: { ...customer, firstName: '' }, error: 'Error: First Name is required' },
    { field: 'last name', data: { ...customer, lastName: '' }, error: 'Error: Last Name is required' },
    { field: 'postal code', data: { ...customer, postalCode: '' }, error: 'Error: Postal Code is required' },
  ];

  for (const { field, data, error } of missingFields) {
    test(`checkout form requires ${field} @regression`, async ({ page, loggedInPage, cartPage, checkoutPage }) => {
      await loggedInPage.addToCart(products.bikeLight.name);
      await loggedInPage.openCart();
      await cartPage.checkout();

      await checkoutPage.fillInformation(data);

      await expect(checkoutPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
