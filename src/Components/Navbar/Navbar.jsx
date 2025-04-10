import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';


const homeTitle = 'Home'
const peopleTitle = 'View All People'
const manuscriptTitle = 'Dashboard'
// const textTitle = 'Text'
const aboutTitle = 'About'
const mastheadTitle = 'Masthead'
const loginTitle = 'Login'

const PAGES = [
  { label: homeTitle, destination: '/' },
  { label: peopleTitle, destination: '/people' },
  { label: mastheadTitle, destination: '/masthead' },
  { label: manuscriptTitle, destination: '/manuscripts' },
  // { label: textTitle, destination: '/texts'},
  { label: aboutTitle, destination: '/about'},
  // { label: 'Submit Manuscript', destination: '/manuscripts/create' },
  { label: loginTitle, destination: '/login' },
];

function NavLink({ page }) {
  const { label, destination } = page;
  return (
    <li>
      <Link to={destination}>{label}</Link>
    </li>
  );
}
NavLink.propTypes = {
  page: propTypes.shape({
    label: propTypes.string.isRequired,
    destination: propTypes.string.isRequired,
  }).isRequired,
};

function Navbar() {
  return (
    <nav>
      <ul className="wrapper">
        {PAGES.map((page) => <NavLink key={page.destination} page={page} />)}
      </ul>
    </nav>
  );
}

export default Navbar;

export {
  homeTitle,
  peopleTitle,
  manuscriptTitle,
  // textTitle,
  aboutTitle,
  mastheadTitle,
  loginTitle,
}