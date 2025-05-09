import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import People from './Components/People';
import Manuscripts from './Components/Manuscript';
import About from './Components/About';
import PersonPage from './Components/PersonPage';
import Masthead from './Components/Masthead';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));

  const handleNavToggle = (open) => {
    setIsNavOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    alert('Logged out successfully!');
  };

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
            <h1 className="site-title">GOODNAME JOURNAL</h1>
            {isLoggedIn && (
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
            )}
          </header>

          {/* ✅ 用组件替换 nav 手写部分 */}
          <div
              className={`side-navbar ${isNavOpen ? 'open' : ''}`}
              onMouseLeave={() => handleNavToggle(false)}
          >
            <Navbar isLoggedIn={isLoggedIn} />
          </div>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
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
