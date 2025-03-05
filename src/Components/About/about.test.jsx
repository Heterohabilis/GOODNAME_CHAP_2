import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About';

const aboutHeader = "About Us";
const aboutButton = "Add a Text";

describe('About Component', () => {
    it('renders about details correctly', async () => {
        render(<About />);

        await screen.findByRole('heading');
        expect(screen.getByRole('heading')).toHaveTextContent(aboutHeader);

        const addButton = screen.getByRole('button', { name: /Add a Text/i });
        expect(addButton).toHaveTextContent(aboutButton);
    });
});
