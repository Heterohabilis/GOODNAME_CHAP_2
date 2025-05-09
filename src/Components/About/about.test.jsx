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
    it('renders about details and update button for admin', async () => {
        axios.get.mockResolvedValue({ data: aboutResponse });

        render(<About isLoggedIn={true} isAdmin={true} />);

        await waitFor(() => {
            expect(screen.getByRole('heading')).toHaveTextContent(aboutResponse.ABOUT.title);
        });

        await waitFor(() => {
            expect(screen.getByText(aboutResponse.ABOUT.text)).toBeInTheDocument();
        });

        const updateTextButton = screen.getByRole('button', { name: aboutResponse.ABOUT.button });
        expect(updateTextButton).toBeInTheDocument();
    });

    it('does NOT show update button for non-admin users', async () => {
        axios.get.mockResolvedValue({ data: aboutResponse });

        render(<About isLoggedIn={true} isAdmin={false} />);

        await waitFor(() => {
            expect(screen.getByText(aboutResponse.ABOUT.text)).toBeInTheDocument();
        });

        expect(screen.queryByRole('button', { name: aboutResponse.ABOUT.button })).not.toBeInTheDocument();
    });

    it('does NOT show update button for logged-out users', async () => {
        axios.get.mockResolvedValue({ data: aboutResponse });

        render(<About isLoggedIn={false} isAdmin={false} />);

        await waitFor(() => {
            expect(screen.getByText(aboutResponse.ABOUT.text)).toBeInTheDocument();
        });

        expect(screen.queryByRole('button', { name: aboutResponse.ABOUT.button })).not.toBeInTheDocument();
    });
});
