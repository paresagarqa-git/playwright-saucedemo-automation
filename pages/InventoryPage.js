// @ts-check
const { BasePage } = require('./BasePage');

/** Turns "Sauce Labs Backpack" into "sauce-labs-backpack" (SauceDemo's data-test id format). */
const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/\./g, '-');

class InventoryPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  /** @param {string} productName */
  async addToCart(productName) {
    await this.page.getByTestId(`add-to-cart-${toSlug(productName)}`).click();
  }

  /** @param {string} productName */
  async removeFromCart(productName) {
    await this.page.getByTestId(`remove-${toSlug(productName)}`).click();
  }

  /** @param {'az' | 'za' | 'lohi' | 'hilo'} option */
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  /** @returns {Promise<string[]>} */
  async getProductNames() {
    return this.itemNames.allTextContents();
  }

  /** @returns {Promise<number[]>} */
  async getProductPrices() {
    const prices = await this.itemPrices.allTextContents();
    return prices.map((p) => Number(p.replace('$', '')));
  }
}

module.exports = { InventoryPage };
