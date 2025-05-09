import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

const homeResponse = {
    HOME: {
        title: 'HOME',
        text: 'Journal-test',
        button: 'Update Text',
    },
};

describe('Home Component', () => {
    it('renders the home header and update button for admin', async () => {
        axios.get.mockResolvedValue({ data: homeResponse });

        render(<Home isLoggedIn={true} isAdmin={true} />); // ✅ Admin case

        await waitFor(() => {
            expect(screen.getByRole('heading')).toHaveTextContent(homeResponse.HOME.title);
        });

        await waitFor(() => {
            expect(screen.getByText(homeResponse.HOME.text)).toBeInTheDocument();
        });

        const updateButton = screen.getByRole('button', { name: homeResponse.HOME.button });
        expect(updateButton).toBeInTheDocument();
    });

    it('does not show update button for non-admin user', async () => {
        axios.get.mockResolvedValue({ data: homeResponse });

        render(<Home isLoggedIn={true} isAdmin={false} />); // ✅ Non-admin case

        await waitFor(() => {
            expect(screen.getByRole('heading')).toHaveTextContent(homeResponse.HOME.title);
        });

        expect(screen.queryByRole('button', { name: homeResponse.HOME.button })).not.toBeInTheDocument();
    });
});
