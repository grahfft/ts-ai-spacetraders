import { test } from '@playwright/test';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailsPage } from './pages/AgentDetailsPage';

test('accept contract from summary section', async ({ page }) => {
  const agents = new AgentsPage(page);
  await agents.goto();
  await agents.openCreateModal();
  const symbol = `T${Date.now().toString().slice(-6)}`;
  await agents.submitCreate(symbol, 'COSMIC');
  const details = new AgentDetailsPage(page);
  await details.expectLoaded();
  await details.acceptFirstContractInlineInSummary();
});


