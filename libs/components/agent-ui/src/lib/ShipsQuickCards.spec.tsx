import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ShipsQuickCards } from './ShipsQuickCards';

describe('ShipsQuickCards (BDD)', () => {
  it('Given we are on the summary, Then we see quick cards for ships', () => {
    render(<ShipsQuickCards ships={[{ symbol: 'SHIP-1', role: 'HAULER' }]} />);
    expect(screen.getByText(/ship-1/i)).toBeInTheDocument();
    expect(screen.getByText(/hauler/i)).toBeInTheDocument();
  });
});


