import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { BACKEND_URL } from './constants';

import People from './Components/People';
import Manuscripts from './Components/Manuscript';
import About from './Components/About';
import PersonPage from './Components/PersonPage';
import Masthead from './Components/Masthead';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';

const ADMIN_CHECK_ENDPOINT = `${BACKEND_URL}/check_admin`;

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));
  const [isAdmin, setIsAdmin] = useState(false);

  const handleNavToggle = (open) => {
    setIsNavOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsAdmin(false);
    alert('Logged out successfully!');
  };

  // ⛓️ 检查当前用户是否是 admin
  useEffect(() => {
    if (isLoggedIn) {
      const email = localStorage.getItem('userEmail');
      axios
          .get(`${ADMIN_CHECK_ENDPOINT}/${email}`)
          .then((res) => {
            setIsAdmin(res.data.is_admin);
          })
          .catch((err) => {
            console.error('Failed to check admin status:', err);
            setIsAdmin(false);
          });
    } else {
      setIsAdmin(false);
    }
  }, [isLoggedIn]);

  return (
      <BrowserRouter>
        <div className="app-container">
          <header className="top-bar">
            <div
                className="nav-toggle-icon"
                onMouseEnter={() => handleNavToggle(true)}
                onClick={() => handleNavToggle(!isNavOpen)}
            >
              &#9776;
            </div>

            <div className="header-center">
              <h1 className="site-title">GOODNAME JOURNAL</h1>
            </div>

            <div className="header-right">
              <p className="login-banner">
                {isLoggedIn
                    ? `Welcome back, ${isAdmin ? 'admin' : 'user'}: ${localStorage.getItem('userEmail')}!`
                    : 'Please log in!'}
              </p>
              {isLoggedIn && (
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
              )}
            </div>
          </header>

          <div
              className={`side-navbar ${isNavOpen ? 'open' : ''}`}
              onMouseLeave={() => handleNavToggle(false)}
          >
            <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          </div>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} isAdmin={isAdmin} />} />
              <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
              {isLoggedIn && (
                  <>
                    <Route path="/people" element={<People />} />
                    <Route path="/people/:email" element={<PersonPage />} />
                    <Route path="/masthead" element={<Masthead />} />
                    <Route path="/manuscripts" element={<Manuscripts />} />
                    <Route path="/about" element={<About />} />
                  </>
              )}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
  );
}

export default App;
