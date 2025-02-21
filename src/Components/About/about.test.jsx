import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import About from '../About';

jest.mock('axios');

describe('About Component', () => {
    const mockResponse = {
        ABOUT: {
            title: "ABOUT",
            text: "this is the about page",
            email: "yuzukar@nyu.edu"
        }
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockResponse });
    });

    it('renders about page correctly', async () => {
        render(<About />);

        await waitFor(() => {
            const heading = screen.getByRole('heading', { level: 2 }); 
            expect(heading).toHaveTextContent(mockResponse.ABOUT.title);
        });
        expect(screen.getByText(mockResponse.ABOUT.text)).toBeInTheDocument();
    });

    it('displays error message when API call fails', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        render(<About />);

        await waitFor(() => expect(screen.getByText(/There was a problem retrieving the text/i)).toBeInTheDocument());
    });

    it('renders "Add a Text" button', async () => {
        render(<About />);
        await screen.findByRole('button', { name: /Add a Text/i });

        const addButton = screen.getByRole('button', { name: /Add a Text/i });
        expect(addButton).toBeInTheDocument();
    });

    it('opens the add text form when "Add a Text" is clicked', async () => {
        render(<About />);

        const addButton = await screen.findByRole('button', { name: /Add a Text/i });
        fireEvent.click(addButton);

        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Text/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    it('closes the add text form when "Cancel" is clicked', async () => {
        render(<About />);

        const addButton = await screen.findByRole('button', { name: /Add a Text/i });
        fireEvent.click(addButton);

        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);

        expect(screen.queryByLabelText(/Title/i)).not.toBeInTheDocument();
    });
});