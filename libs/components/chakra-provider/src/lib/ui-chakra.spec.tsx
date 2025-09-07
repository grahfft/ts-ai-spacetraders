import { render, screen } from '@testing-library/react';
import { AppChakraProvider } from './ui-chakra';

describe('AppChakraProvider', () => {
  it('renders children', () => {
    render(
      <AppChakraProvider>
        <div data-testid="child">child</div>
      </AppChakraProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
