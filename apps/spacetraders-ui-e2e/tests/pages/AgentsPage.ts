import { Page, expect } from '@playwright/test';

export class AgentsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  addAgentButton() {
    return this.page.getByRole('button', { name: /add new agent/i });
  }

  async openCreateModal() {
    await this.addAgentButton().click();
  }

  async submitCreate(symbol: string, faction: string) {
    await this.page.getByLabel(/agent symbol/i).fill(symbol);
    await this.page.getByLabel(/faction/i).fill(faction);
    await this.page.getByRole('button', { name: /register/i }).click();
  }

  async expectRowFor(symbol: string) {
    await expect(this.page.getByRole('row', { name: new RegExp(symbol, 'i') })).toBeVisible();
  }
}


