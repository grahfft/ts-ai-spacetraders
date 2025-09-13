import { test, expect } from '@playwright/test';
import { AgentsJourney } from './flows/AgentsJourney';

test('create agent then lands on details page', async ({ page }) => {
  const agentsJourney = new AgentsJourney(page);
  const symbol = `T${Date.now().toString().slice(-6)}`;
  await agentsJourney.createAgent(symbol, 'COSMIC');
  await expect(page.getByRole('heading', { name: /agent/i })).toBeVisible();
});


