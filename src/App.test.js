import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Step Zero header', () => {
  render(<App />);
  const headerElement = screen.getByText(/This is Step Zero/i);
  expect(headerElement).toBeInTheDocument();
});
