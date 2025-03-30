import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import About from '../About';

jest.mock('axios');

const aboutResponse = {
    ABOUT: {
        title: "ABOUT",
        text: "this is the about page",
        button: "Update Text"
    }
};

describe('About Component', () => {
    it('renders about details correctly after API call', async () => {
        axios.get.mockResolvedValue({ data: aboutResponse });

        render(<About />);

        await waitFor(() => {
            const heading = screen.getByRole('heading');
            expect(heading).toHaveTextContent(aboutResponse.ABOUT.title);
        });

        await waitFor(() => {
            const aboutText = screen.getByText(aboutResponse.ABOUT.text);
            expect(aboutText).toBeInTheDocument();
        });

        const updateTextButton = screen.getByRole('button', { name: aboutResponse.ABOUT.button });
        expect(updateTextButton).toBeInTheDocument();
    });
});
