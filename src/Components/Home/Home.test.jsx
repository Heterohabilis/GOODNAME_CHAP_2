import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import '@testing-library/jest-dom';

describe('Home Component', () => {
    it('renders the home header', async () => {
        render(<Home />);

        const headerElement = screen.getByRole('heading', {
        name: /Journal-Home/});
        expect(headerElement).toBeInTheDocument();

        const updateButton = screen.getByRole('button', { name: /Update Text/i });
        expect(updateButton).toBeInTheDocument();


    });
});