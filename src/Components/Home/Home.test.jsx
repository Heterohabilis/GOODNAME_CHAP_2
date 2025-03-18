import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home'; // Make sure to adjust the import according to your project structure
import '@testing-library/jest-dom';

describe('Home Component', () => {
    test('renders the home header', () => {
        render(<Home />);

        const headerElement = screen.getByRole('heading', {
        name: /Journal of React/i
    });
        expect(headerElement).toBeInTheDocument();

        expect(headerElement).toHaveStyle('text-align: center');
    });
});