import { test } from '@playwright/test';
import { AgentsJourney } from './flows/AgentsJourney';

test('accept contract from summary section', async ({ page }) => {
  const agentsJourney = new AgentsJourney(page);
  const symbol = `T${Date.now().toString().slice(-6)}`;
  const agentDetailsPage = await agentsJourney.createAgent(symbol, 'COSMIC');
  await agentsJourney.acceptFirstContractFromSummary(agentDetailsPage);
});


