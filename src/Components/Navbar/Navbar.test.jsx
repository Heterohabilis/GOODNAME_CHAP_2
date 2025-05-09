import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import {
  homeTitle,
  peopleTitle,
  manuscriptTitle,
  aboutTitle,
  loginTitle,
  mastheadTitle,
} from './Navbar';

describe('Navbar Component', () => {
  it('renders correct links when logged in', () => {
    render(
        <BrowserRouter>
          <Navbar isLoggedIn={true} isAdmin={true} />
        </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: homeTitle })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: peopleTitle })).toHaveAttribute('href', '/people');
    expect(screen.getByRole('link', { name: mastheadTitle })).toHaveAttribute('href', '/masthead');
    expect(screen.getByRole('link', { name: manuscriptTitle })).toHaveAttribute('href', '/manuscripts');
    expect(screen.getByRole('link', { name: aboutTitle })).toHaveAttribute('href', '/about');
    expect(screen.queryByRole('link', { name: loginTitle })).not.toBeInTheDocument(); // ✅ 确保不显示 Login
  });

  it('renders correct links when not logged in', () => {
    render(
        <BrowserRouter>
          <Navbar isLoggedIn={false} />
        </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: homeTitle })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: loginTitle })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: peopleTitle })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: manuscriptTitle })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: aboutTitle })).not.toBeInTheDocument();
  });
});
