import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const homeTitle = 'Home';
const peopleTitle = 'View All People';
const manuscriptTitle = 'Dashboard';
// const textTitle = 'Text';
const aboutTitle = 'About';
const mastheadTitle = 'Masthead';
const loginTitle = 'Login';

const ALL_PAGES = [
  { label: homeTitle, destination: '/' },
  { label: peopleTitle, destination: '/people' },
  { label: mastheadTitle, destination: '/masthead' },
  { label: manuscriptTitle, destination: '/manuscripts' },
  // { label: textTitle, destination: '/texts'},
  { label: aboutTitle, destination: '/about' },
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

function Navbar({ isLoggedIn }) {
  const filteredPages = ALL_PAGES.filter((p) =>
      isLoggedIn ? p.label !== loginTitle : [homeTitle, loginTitle].includes(p.label)
  );

  return (
      <nav>
        <ul className="wrapper">
          {filteredPages.map((page) => (
              <NavLink key={page.destination} page={page} />
          ))}
        </ul>
      </nav>
  );
}


Navbar.propTypes = {
  isLoggedIn: propTypes.bool.isRequired,
};

export default Navbar;

export {
  homeTitle,
  peopleTitle,
  manuscriptTitle,
  // textTitle,
  aboutTitle,
  mastheadTitle,
  loginTitle,
};
