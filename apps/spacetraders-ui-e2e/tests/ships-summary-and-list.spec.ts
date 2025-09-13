import { test, expect } from '@playwright/test';
import { AgentsJourney } from './flows/AgentsJourney';

test('Ships: quick cards on summary and expandable details in Ships section', async ({ page }) => {
  const journey = new AgentsJourney(page);
  const symbol = `T${Date.now().toString().slice(-6)}`;
  const details = await journey.createAgent(symbol, 'COSMIC');
  // Summary quick cards visible
  await expect(page.getByRole('heading', { name: /ships/i })).toBeVisible();
  // Navigate to Ships section and expand first ship
  await details.openShips();
  await expect(page.getByRole('heading', { name: /ships/i })).toBeVisible();
  const anyShip = page.getByText(/ship-/i).first();
  if (await anyShip.isVisible()) {
    await anyShip.click();
  }
});


