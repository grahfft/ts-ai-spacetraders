import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShipsQuickCards } from './ShipsQuickCards';

describe('ShipsQuickCards (BDD)', () => {
  it('Given we are on the summary, Then we see quick cards for ships', () => {
    render(<ShipsQuickCards ships={[{ symbol: 'SHIP-1', role: 'HAULER' }]} />);
    expect(screen.getByText(/ship-1/i)).toBeInTheDocument();
    expect(screen.getByText(/hauler/i)).toBeInTheDocument();
  });

  it('Given onSelectShip is provided, When clicking a card, Then it is called with the symbol', () => {
    const onSelect = jest.fn();
    render(<ShipsQuickCards ships={[{ symbol: 'SHIP-2', role: 'MINER' }]} onSelectShip={onSelect} />);
    fireEvent.click(screen.getByText(/ship-2/i));
    expect(onSelect).toHaveBeenCalledWith('SHIP-2');
  });
});


