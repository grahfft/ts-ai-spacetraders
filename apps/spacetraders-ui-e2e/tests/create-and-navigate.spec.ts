import { test, expect } from '@playwright/test';
import { AgentsPage } from './pages/AgentsPage';

test('create agent then lands on details page', async ({ page }) => {
  const agents = new AgentsPage(page);
  await agents.goto();
  await agents.openCreateModal();
  const symbol = `T${Date.now().toString().slice(-6)}`;
  await agents.submitCreate(symbol, 'COSMIC');
  await expect(page.getByRole('heading', { name: /agent/i })).toBeVisible();
});


