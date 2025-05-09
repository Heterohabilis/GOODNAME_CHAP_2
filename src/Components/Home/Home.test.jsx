import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import Home from './Home';
import '@testing-library/jest-dom';
import axios from "axios";

jest.mock('axios');

const homeResponse = {
    HOME: {
        title: "HOME",
        text: "Journal-test",
        button: "Update Text"
    }
};

describe('Home Component', () => {
    it('renders the home header', async () => {
        axios.get.mockResolvedValue({ data: homeResponse });

        render(<Home isLoggedIn={true} />); // ✅ 传入登录状态

        await waitFor(() => {
            const heading = screen.getByRole('heading');
            expect(heading).toHaveTextContent(homeResponse.HOME.title);
        });

        await waitFor(() => {
            const aboutText = screen.getByText(homeResponse.HOME.text);
            expect(aboutText).toBeInTheDocument();
        });

        const updateButton = screen.getByRole('button', { name: homeResponse.HOME.button });
        expect(updateButton).toBeInTheDocument();
    });
});
