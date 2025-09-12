import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContractsList } from './ContractsList';

describe('ContractsList (BDD)', () => {
  it('Given a contract is visible, When clicking Accept, Then onAccept is called with id', () => {
    const onAccept = jest.fn();
    render(
      <ContractsList
        loading={false}
        contracts={[{ id: 'c1', type: 'PROCUREMENT', accepted: false, terms: { deadline: '2025-01-01' } }]}
        expanded={{}}
        accepting={{}}
        onToggleExpand={jest.fn()}
        onAccept={onAccept}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /accept/i }));
    expect(onAccept).toHaveBeenCalledWith('c1');
  });
  it('Given a contract, When expanding, Then details render', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <ContractsList
        loading={false}
        contracts={[{ id: 'c1', type: 'PROCUREMENT', accepted: false, terms: { deadline: '2025-01-01', deliver: [{ unitsRequired: 1, tradeSymbol: 'FOO', destinationSymbol: 'BAR' }] } }]}
        expanded={{ c1: true }}
        accepting={{}}
        onToggleExpand={onToggle}
        onAccept={jest.fn()}
      />
    );
    expect(getByText(/deliveries/i)).toBeInTheDocument();
  });
});


