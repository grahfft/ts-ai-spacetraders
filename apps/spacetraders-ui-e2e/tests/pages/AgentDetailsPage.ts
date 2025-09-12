import { Page, expect } from '@playwright/test';

export class AgentDetailsPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: /agent/i })).toBeVisible();
  }

  contractsSection() {
    return this.page.getByRole('button', { name: /contracts/i });
  }

  async openContracts() {
    await this.contractsSection().click();
  }

  async acceptFirstContract() {
    const btn = this.page.getByRole('button', { name: /^accept$/i }).first();
    await btn.click();
  }

  async acceptFirstContractInlineInSummary() {
    await this.page.getByRole('heading', { name: /contracts/i }).scrollIntoViewIfNeeded();
    const btn = this.page.getByRole('button', { name: /^accept$/i }).first();
    await btn.click();
  }

  async expandFirstContract() {
    const header = this.page.getByText(/deadline:/i).first();
    await header.click();
  }
}


