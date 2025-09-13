import { Page } from '@playwright/test';
import { AgentsPage } from '../pages/AgentsPage';
import { AgentDetailsPage } from '../pages/AgentDetailsPage';

export class AgentsJourney {
  constructor(private readonly page: Page) {}

  async createAgent(symbol: string, faction: string): Promise<AgentDetailsPage> {
    const agents = new AgentsPage(this.page);
    await agents.goto();
    await agents.openCreateModal();
    await agents.submitCreate(symbol, faction);
    const details = new AgentDetailsPage(this.page);
    await details.expectLoaded();
    return details;
  }

  async navigateToContracts(details: AgentDetailsPage): Promise<void> {
    await details.openContracts();
  }

  async acceptFirstContractFromSummary(details: AgentDetailsPage): Promise<void> {
    await details.acceptFirstContractInlineInSummary();
  }
}


