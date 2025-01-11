import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';


describe('App Component', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  it('check table render', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    );
    render(<App />);

    await waitFor(() => {
      const table = screen.getByTestId('data-table');
      expect(table).toBeInTheDocument();
    });
  });

});