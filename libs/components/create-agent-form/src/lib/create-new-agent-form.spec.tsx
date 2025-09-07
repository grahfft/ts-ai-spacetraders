import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { CreateNewAgentForm } from './create-new-agent-form';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios> & { create: jest.Mock };

function setup() {
  return render(<CreateNewAgentForm defaultSymbol="ABC" defaultFaction="COSMIC" />);
}

describe('CreateNewAgentForm', () => {
  beforeEach(() => {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockImplementation((key: string) => null);
    jest
      .spyOn(window.localStorage.__proto__, 'setItem')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('submits and stores token on success', async () => {
    mockedAxios.post.mockResolvedValue({ data: { data: { token: 'T123' } } } as any);

    setup();

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/create-new-agent', {
        symbol: 'ABC',
        faction: 'COSMIC',
        email: '',
      });
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('SPACE_TRADERS_TOKEN', 'T123');
  });

  it('renders error on failure', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { error: { message: 'Bad' } } } } as any);

    setup();
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await screen.findByText(/Error: Bad/i);
  });
});
