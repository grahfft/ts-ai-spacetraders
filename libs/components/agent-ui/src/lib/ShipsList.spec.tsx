import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShipsList } from './ShipsList';

// TDD: ShipsList not implemented yet
// We'll assert behavior: renders rows with basic info, clicking a row expands details

describe('ShipsList (BDD)', () => {
  const ships = [
    {
      symbol: 'SHIP-1',
      role: 'HAULER',
      nav: { status: 'DOCKED', systemSymbol: 'X1', waypointSymbol: 'X1-A1' },
      crew: { capacity: 8 },
      frame: { name: 'FRAME-A' },
      reactor: { name: 'REACTOR-A' },
      engine: { name: 'ENGINE-A' },
      cargo: { units: 10, capacity: 60 },
    },
  ];

  it('Given ships exist, Then list shows quick info and can expand to full details', () => {
    render(<ShipsList ships={ships} />);
    expect(screen.queryByText(/ship-1/i)).toBeInTheDocument();
    // expand
    fireEvent.click(screen.getByText(/ship-1/i));
    expect(screen.queryByText(/status: docked/i)).toBeInTheDocument();
    expect(screen.queryByText(/cargo: 10\/60/i)).toBeInTheDocument();
  });
});


