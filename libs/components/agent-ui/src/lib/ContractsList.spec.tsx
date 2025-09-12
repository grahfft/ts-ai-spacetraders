import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContractsList } from './ContractsList';

describe('ContractsList', () => {
  it('renders contracts and calls onAccept', () => {
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
});


