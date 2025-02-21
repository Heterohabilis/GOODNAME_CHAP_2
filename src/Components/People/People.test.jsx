import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import People from '../People';

describe('People Component', () => {
    it('renders people list header and add button', async () => {
        render(<People />);
        expect(screen.getByRole('heading', { name: /View All People/i })).toBeInTheDocument();
        const addButton = screen.getByRole('button', { name: /Add a Person/i });
        expect(addButton).toBeInTheDocument();
    });
});
