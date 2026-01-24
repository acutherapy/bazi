import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Bazi Calculator title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Bazi Calculator/i);
  expect(linkElement).toBeInTheDocument();
});
