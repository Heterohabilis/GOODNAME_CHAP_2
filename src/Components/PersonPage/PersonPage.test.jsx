// PersonPage.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PersonPage from '../PersonPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('axios');

const mockPersonData = {
  name: 'John Doe',
  roles: ['AU', 'ED'],
  affiliation: 'University X',
};

describe('PersonPage Component', () => {
  it('renders person details correctly after API call', async () => {
    axios.get.mockResolvedValue({ data: mockPersonData });

    render(
        <MemoryRouter initialEntries={['/people/john@example.com']}>
          <Routes>
            <Route path="/people/:email" element={<PersonPage />} />
          </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /john doe/i })).toBeInTheDocument();

      expect(screen.getByText(/Role:/).parentElement).toHaveTextContent('Role: Author, Editor');

      expect(screen.getByText(/Affiliation:/).parentElement).toHaveTextContent('Affiliation: University X');
    });
  });
});
