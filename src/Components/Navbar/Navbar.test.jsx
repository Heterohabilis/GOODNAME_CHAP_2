import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import { homeTitle, peopleTitle, manuscriptTitle, textTitle, aboutTitle} from './Navbar';

describe('Navbar Component', () => {
  it('renders navbar links correctly', () => {
    render(<BrowserRouter>
        <Navbar />
      </BrowserRouter>);

    const homeLink = screen.getByRole('link', { name: homeTitle });
    expect(homeLink).toHaveAttribute('href', '/');

    const peopleLink = screen.getByRole('link', { name: peopleTitle });
    expect(peopleLink).toHaveAttribute('href', '/people');

    const manuscriptsLink = screen.getByRole('link', { name: manuscriptTitle });
    expect(manuscriptsLink).toHaveAttribute('href', '/manuscripts');

    const textsLink = screen.getByRole('link', { name: textTitle });
    expect(textsLink).toHaveAttribute('href', '/texts');

    const aboutLink = screen.getByRole('link', { name: aboutTitle });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});