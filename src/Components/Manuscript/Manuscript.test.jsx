import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Manuscript from '../Manuscript';
import { manuscriptHeader, manuscriptButton } from './Manuscript';

describe('Manuscript Component', () => {
  it('renders manuscript details correctly', async () => {
    render(<Manuscript />)

    await screen.findByRole('heading');

    expect(screen.getByRole('heading'))
    .toHaveTextContent(manuscriptHeader)

    const addButton = screen.getByRole('button', { name: /Add a Manuscript/i });
    expect(addButton).toHaveTextContent(manuscriptButton); 

  });
});
