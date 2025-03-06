import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import About from '../About';

jest.mock('axios');

const aboutResponse = {
    ABOUT: {
        title: "ABOUT",
        text: "This is the About section."
    }
};

describe('About Component', () => {
    it('renders about details correctly after API call', async () => {
        // Mock the Axios GET request
        axios.get.mockResolvedValue({ data: aboutResponse });

        render(<About />);

        // Ensure API call resolves and updates the component
        await waitFor(() => {
            const heading = screen.getByRole('heading');
            expect(heading).toHaveTextContent("ABOUT");
        });

        // Check if the "Update Text" button is present
        const updateTextButton = screen.getByRole('button', { name: /Update Text/i });
        expect(updateTextButton).toBeInTheDocument();
    });
});
