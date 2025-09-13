import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgentDetailsProvider, useAgentDetails } from './AgentDetailsContext';

function Harness() {
  const { section, openShipSymbol, setSection, requestOpenShip, consumeOpenShip } = useAgentDetails();
  return (
    <div>
      <div data-testid="section">{section}</div>
      <div data-testid="openShip">{openShipSymbol ?? ''}</div>
      <button onClick={() => setSection('contracts')}>to-contracts</button>
      <button onClick={() => requestOpenShip('SHIP-1')}>open-ship</button>
      <button onClick={() => consumeOpenShip()}>consume</button>
    </div>
  );
}

describe('AgentDetailsContext (BDD)', () => {
  it('setSection changes section', () => {
    render(<AgentDetailsProvider><Harness /></AgentDetailsProvider>);
    expect(screen.getByTestId('section')).toHaveTextContent('summary');
    fireEvent.click(screen.getByText('to-contracts'));
    expect(screen.getByTestId('section')).toHaveTextContent('contracts');
  });

  it('requestOpenShip sets section ships and openShipSymbol; consume clears it', () => {
    render(<AgentDetailsProvider><Harness /></AgentDetailsProvider>);
    fireEvent.click(screen.getByText('open-ship'));
    expect(screen.getByTestId('section')).toHaveTextContent('ships');
    expect(screen.getByTestId('openShip')).toHaveTextContent('SHIP-1');
    fireEvent.click(screen.getByText('consume'));
    expect(screen.getByTestId('openShip')).toHaveTextContent('');
  });
});


