// @ts-check
const { test, expect } = require('../../fixtures/test-fixtures');

test.describe('Product sorting', () => {
  test('sorts products by price, low to high @regression', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('lohi');

    const prices = await loggedInPage.getProductPrices();
    const expected = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(expected);
  });

  test('sorts products by price, high to low @regression', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('hilo');

    const prices = await loggedInPage.getProductPrices();
    const expected = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(expected);
  });

  test('sorts products by name, Z to A @regression', async ({ loggedInPage }) => {
    await loggedInPage.sortBy('za');

    const names = await loggedInPage.getProductNames();
    const expected = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(expected);
  });
});
