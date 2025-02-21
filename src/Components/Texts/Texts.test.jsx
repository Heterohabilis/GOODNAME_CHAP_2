import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Texts from '../Texts';

describe('Texts Component', () => {
    it('renders text list header and add button', async () => {
        render(<Texts />);
        expect(screen.getByRole('heading', { name: /View All Text/i })).toBeInTheDocument();
        const addButton = screen.getByRole('button', { name: /Add a Text/i });
        expect(addButton).toBeInTheDocument();
    });
});
