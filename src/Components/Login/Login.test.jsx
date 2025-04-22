import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

describe('Login Component (direct form rendering)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form with email and password inputs', () => {
        render(<Login />);

        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test('successfully logs in', async () => {
        axios.put.mockResolvedValueOnce({ data: {} });
        window.alert = jest.fn();  // mock alert

        render(<Login />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining('/login'),
                { username: 'user@example.com', password: 'password123' }
            );
            expect(window.alert).toHaveBeenCalledWith('Logged in successfully!');
        });
    });

    test('shows error message on failed login', async () => {
        axios.put.mockRejectedValueOnce(new Error('Invalid credentials'));

        render(<Login />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpass' },
        });

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        const errorMessage = await screen.findByText(/login failed/i);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('Login failed: Invalid credentials');
    });
});