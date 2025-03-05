import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About';

const aboutHeader = "About Us";
const updateButton = "Update Text";

describe('About Component', () => {
    it('renders about details correctly', async () => {
        render(<About />);

        // Ensure the heading is displayed correctly
        await screen.findByRole('heading');
        expect(screen.getByRole('heading')).toHaveTextContent(aboutHeader);

        // Check if the "Update Text" button is present instead of "Add a Text"
        const updateTextButton = screen.getByRole('button', { name: /Update Text/i });
        expect(updateTextButton).toHaveTextContent(updateButton);
    });
});