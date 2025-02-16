import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event'

import App from './App';
import { homeHeader } from './App';

describe('App', () => {
  it('renders nav and home', async () => {
    render(<App />)

    await screen.findByRole('heading');

    expect(screen.getByRole('heading'))
    .toHaveTextContent(homeHeader)
  
  })
  });
  
