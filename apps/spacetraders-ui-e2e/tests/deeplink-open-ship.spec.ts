import { test, expect } from '@playwright/test';
import { AgentsJourney } from './flows/AgentsJourney';

test('Deep link: /agent/{id}?ship=SYMBOL opens that ship in Ships tab', async ({ page }) => {
  const journey = new AgentsJourney(page);
  const symbol = `T${Date.now().toString().slice(-6)}`;
  const details = await journey.createAgent(symbol, 'COSMIC');
  await details.expectLoaded();
  // Grab first ship symbol from quick cards (by text pattern)
  const firstShip = page.getByText(/ship-/i).first();
  const shipText = await firstShip.textContent();
  const shipSymbol = shipText?.trim() || 'SHIP-1';
  const url = page.url();
  const id = url.split('/agent/')[1]?.split('?')[0];
  await page.goto(`/agent/${id}?ship=${encodeURIComponent(shipSymbol)}`);
  await expect(page.getByRole('heading', { name: /ships/i })).toBeVisible();
  await expect(page.getByText(new RegExp(`^${shipSymbol}$`, 'i'))).toBeVisible();
});


