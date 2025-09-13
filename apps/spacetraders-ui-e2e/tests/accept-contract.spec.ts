import { test } from '@playwright/test';
import { AgentsJourney } from './flows/AgentsJourney';

test('create agent then accept contract from contracts section', async ({ page }) => {
  const agentsJourney = new AgentsJourney(page);
  const symbol = `T${Date.now().toString().slice(-6)}`;
  const agentDetailsPage = await agentsJourney.createAgent(symbol, 'COSMIC');
  await agentsJourney.navigateToContracts(agentDetailsPage);
  await agentDetailsPage.acceptFirstContract();
});


