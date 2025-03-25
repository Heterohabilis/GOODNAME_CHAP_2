// Masthead.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Masthead from '../Masthead';

jest.mock('axios');

const mockMastheadData = {
  MASTHEAD: {
    Editor: [
      { name: "Alice Smith", affiliation: "University A" },
      { name: "Bob Johnson", affiliation: "Institute B" }
    ],
    Reviewer: [
      { name: "Carol White", affiliation: "College C" }
    ]
  }
};

describe('Masthead Component', () => {
  it('renders the heading and masthead roles', async () => {
    axios.get.mockResolvedValue({ data: mockMastheadData });

    render(<Masthead />);

    expect(screen.getByRole('heading', { name: /Masthead Roles/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Editor:/)).toBeInTheDocument();
      expect(screen.getByText(/Alice Smith \(University A\)/)).toBeInTheDocument();
      expect(screen.getByText(/Bob Johnson \(Institute B\)/)).toBeInTheDocument();
      expect(screen.getByText(/Reviewer:/)).toBeInTheDocument();
      expect(screen.getByText(/Carol White \(College C\)/)).toBeInTheDocument();
    });
  });
});
