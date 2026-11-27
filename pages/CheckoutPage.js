// @ts-check
const { BasePage } = require('./BasePage');

/** Covers all three checkout steps: information, overview, complete. */
class CheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // Step one: your information
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    // Step two: overview
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    // Complete
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  /** @param {{ firstName: string, lastName: string, postalCode: string }} info */
  async fillInformation({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /**
   * Reads a label like "Item total: $39.98" and returns 39.98.
   * Waits for the label to be visible first and fails loudly if no amount is found,
   * instead of silently returning NaN.
   * @param {import('@playwright/test').Locator} locator
   */
  async amountFrom(locator) {
    const text = await locator.innerText();
    const match = text.replace(/,/g, '').match(/\$(\d+(?:\.\d+)?)/);
    if (!match) throw new Error(`No dollar amount found in "${text}"`);
    return Number(match[1]);
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };
