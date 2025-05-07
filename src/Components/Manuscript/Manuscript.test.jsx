import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Manuscript from '../Manuscript';
import { manuscriptHeader, manuscriptButton } from './Manuscript';

describe('Manuscript Component', () => {
  it('renders manuscript details correctly', async () => {
    render(<Manuscript />)

    expect(screen.getByRole('heading', { name: manuscriptHeader })).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /Add a Manuscript/i });
    expect(addButton).toHaveTextContent(manuscriptButton); 

  });

  it('renders all manuscript columns with headings', () => {
    render(<Manuscript />);

    const states = [
      'SUBMITTED',
      'IN_REF_REV',
      'AUTHOR_REVISION',
      'EDITOR_REV',
      'COPY_EDIT',
      'AUTHOR_REV',
      'FORMATTING',
      'PUBLISHED'
    ];

    states.forEach(state => {
      expect(screen.getByRole('heading', { name: state })).toBeInTheDocument();
    });
  });
});
