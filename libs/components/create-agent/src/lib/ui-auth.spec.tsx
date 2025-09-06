import { render, screen, fireEvent } from '@testing-library/react';
import { AuthRegisterForm } from './ui-auth';

describe('AuthRegisterForm', () => {
  it('renders and allows entering fields', () => {
    render(<AuthRegisterForm />);
    expect(screen.getByText(/Create New Agent/i)).toBeInTheDocument();
    const symbol = screen.getByLabelText(/Agent Symbol/i) as HTMLInputElement;
    fireEvent.change(symbol, { target: { value: 'TEST' } });
    expect(symbol.value).toBe('TEST');
  });
});


